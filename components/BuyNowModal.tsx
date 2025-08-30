"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/products"
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import AuthModal from '@/components/AuthModal/AuthModal'
import { toast } from "sonner"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface BuyNowModalProps {
  product: Product
  onClose: () => void
}

export function BuyNowModal({ product, onClose }: BuyNowModalProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authPromptShown, setAuthPromptShown] = useState(false)
  const [pendingPayment, setPendingPayment] = useState(false)
  const supabase = createClient()
  const { toast: uiToast } = useToast()

  // Initialize session and listen for auth changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[BuyNow] Initial session check:', !!session)
      setSession(session)
    }
    getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[BuyNow] Auth state changed:', event, !!session, session?.user?.id)
      if (event === 'SIGNED_IN' && session) {
        console.log('[BuyNow] User signed in, updating session state')
        setSession(session)
        // Small delay to ensure session is fully propagated
        setTimeout(() => {
          console.log('[BuyNow] Session state updated after sign in')
        }, 100)
      } else if (event === 'SIGNED_OUT') {
        console.log('[BuyNow] User signed out')
        setSession(null)
        setPendingPayment(false)
      } else {
        setSession(session)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Auto-proceed with payment when session becomes available after login
  useEffect(() => {
    if (session && pendingPayment && !showAuthModal && !loading) {
      console.log('[BuyNow] Session available, proceeding with pending payment')
      setPendingPayment(false)
      // Small delay to ensure everything is ready
      setTimeout(() => {
        handlePayment()
      }, 500)
    }
  }, [session, pendingPayment, showAuthModal, loading])

  const handlePayment = async () => {
    console.log('[BuyNow] handlePayment called')
    console.log('[BuyNow] Session exists:', !!session)
    console.log('[BuyNow] Session user:', session?.user?.id)

    // Prevent multiple simultaneous payment attempts
    if (loading) {
      console.log('[BuyNow] Payment already in progress')
      return
    }

    setLoading(true)

    // Double-check session in case it wasn't updated yet
    if (!session) {
      console.log('[BuyNow] No session found, checking again...')
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      console.log('[BuyNow] Re-checked session:', !!currentSession)

      if (!currentSession) {
        if (!authPromptShown) {
          console.log('[BuyNow] Still no session, showing auth modal')
          setLoading(false)
          setShowAuthModal(true)
          setPendingPayment(true)
          setAuthPromptShown(true)
          toast.info("Please sign in to proceed with your order", {
            description: "You'll be redirected back to checkout after signing in."
          })
        } else {
          console.log('[BuyNow] Auth modal already shown, waiting for user action')
          setLoading(false)
          toast.error("Please sign in to complete your purchase", {
            description: "Authentication is required to proceed with checkout."
          })
        }
        return
      }

      // Update session state if we found one
      setSession(currentSession)
      console.log('[BuyNow] Session updated from re-check')
    }

    // Check if address is complete for seamless delivery
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('address_line_1, city, state, pincode')
        .eq('id', session!.user.id)
        .maybeSingle()

      if (profileError) {
        console.error('[BuyNow] Could not fetch user profile for address check:', profileError)
        toast.error("Unable to verify your address. Please try again.")
        setLoading(false)
        return
      }

      if (!profile || !profile.address_line_1 || !profile.city || !profile.state || !profile.pincode) {
        uiToast({
          title: "Address Required",
          description: "Please add your complete address in your profile for seamless delivery.",
          variant: "destructive",
          action: <ToastAction altText="Update Address" onClick={() => {
            window.location.href = '/account'
            onClose()
          }}>Update Address</ToastAction>
        })
        setLoading(false)
        return
      }
    } catch (error) {
      console.error('[BuyNow] Error checking address:', error)
      toast.error("Unable to verify your address. Please try again.")
      setLoading(false)
      return
    }

    console.log('[BuyNow] Session user:', session!.user)
    console.log('[BuyNow] Session user ID:', session!.user.id)
    console.log('[BuyNow] Session user email:', session!.user.email)

    try {
      // Fetch user profile data to get real customer information
      console.log('[BuyNow] Fetching user profile for user ID:', session!.user.id)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', session!.user.id)
        .maybeSingle()

      console.log('[BuyNow] Profile fetch result:', {
        hasProfile: !!profile,
        profileEmail: profile?.email,
        profilePhone: profile?.phone,
        error: profileError?.message
      })

      if (profileError) {
        console.error('[BuyNow] Could not fetch user profile:', profileError)
        console.log('[BuyNow] Will fallback to session user data')
      }

      // Log session user data as fallback
      console.log('[BuyNow] Session user data:', {
        sessionEmail: session!.user.email,
        sessionPhone: session!.user.phone,
        userMetadata: session!.user.user_metadata
      })

      // Prepare single product item
      const singleItem = [{ ...product, quantity: 1 }]
      const totalAmount = product.price

      // Create Razorpay order on server — include items and user_id so server can pre-create pending order
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).access_token}`,
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount),
          currency: 'INR',
          items: singleItem,
          user_id: session!.user.id
        }),
      })

      const order = await response.json()
      console.log('Razorpay order created:', order)
      console.log('[BuyNow] Order amount from API:', order.amount, 'rupees')

      const handlerCalled = { called: false }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Gorkha Leaf',
        description: `Purchase: ${product.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          handlerCalled.called = true
          try {
            console.log('Razorpay payment response:', response)
            console.log('[BuyNow][handler] immediate handler entry', { maskedPaymentId: response?.razorpay_payment_id ? String(response.razorpay_payment_id).slice(0,8)+'...' : null })

            // Prepare customer data with detailed logging
            const customerEmail = profile?.email || session!.user.email
            const customerPhone = profile?.phone || session!.user.phone

            console.log('[BuyNow] Prepared customer data:', {
              customerEmail,
              customerPhone,
              source: profile?.email ? 'profile' : 'session',
              isValidEmail: customerEmail && customerEmail !== 'customer@example.com',
              isValidPhone: customerPhone && customerPhone !== '+919999999999'
            })

            // Validate customer data before sending
            if (!customerEmail || customerEmail === 'customer@example.com') {
              console.error('[BuyNow] CRITICAL: Invalid or missing customer email:', customerEmail)
            }
            if (!customerPhone || customerPhone === '+919999999999') {
              console.error('[BuyNow] CRITICAL: Invalid or missing customer phone:', customerPhone)
            }

            // Save order via API update (mark success)
            const saveBody = {
              user_id: session!.user.id,
              amount: totalAmount,
              currency: 'INR',
              items: singleItem,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: 'success',
              customer_email: customerEmail,
              customer_phone: customerPhone
            }

            console.log('[BuyNow] Final saveBody customer data:', {
              customer_email: saveBody.customer_email,
              customer_phone: saveBody.customer_phone
            })

            const saveResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(session as any).access_token}`
              },
              credentials: 'include',
              body: JSON.stringify(saveBody)
            })

            console.log('[BuyNow] /api/orders response.status', saveResponse.status)
            const respText = await saveResponse.text()
            let respJson = null
            try {
              respJson = respText ? JSON.parse(respText) : null
            } catch (e) {
              console.error('[BuyNow] failed to parse /api/orders response', e, 'body:', respText)
            }

            if (saveResponse.ok) {
              console.log('Order saved successfully via API', respJson)
              toast.success('Payment successful! Thank you for your order.')
              toast.success('You will receive a confirmation call from our team shortly to finalize your order details.', {
                description: 'Our team will contact you within 24 hours.'
              })
              onClose()
              // Redirect to orders page after a delay
              setTimeout(() => {
                window.location.href = '/account/orders'
              }, 2000)
            } else {
              console.error('Order save failed via API:', saveResponse.status, respJson)
              toast.error('Payment verification failed. Please contact support.')
            }

          } catch (error) {
            console.error('Order save error:', error)
            toast.error('Payment verification failed. Please contact support.')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: profile?.full_name || session!.user.user_metadata?.full_name || 'Customer',
          email: profile?.email || session!.user.email || '',
          contact: profile?.phone || session!.user.phone || '',
        },
        notes: {
          address: 'Gorkha Leaf Corporate Office',
        },
        theme: {
          color: '#047857',
        },
      }

      console.log('[BuyNow][debug] Razorpay order details:', {
        orderId: order.id,
        orderAmount: order.amount,
        orderCurrency: order.currency,
        sentAmount: Math.round(totalAmount),
        expectedDisplayAmount: Math.round(totalAmount)
      })
      console.log('[BuyNow][debug] Razorpay options prepared (order.id):', order.id)
      console.log('[BuyNow][debug] Attaching handler and opening Razorpay modal...')

      const rzp = new (window as any).Razorpay(options)

      // Attach explicit success/failure listeners
      rzp.on('payment.failed', function (resp: any) {
        console.error('Razorpay payment failed event:', resp)
        toast.error("Payment failed. Please try again or use a different payment method.")
        setLoading(false)
      })

      // Watchdog: if handler not invoked within 12s, log a warning
      setTimeout(() => {
        if (!handlerCalled.called) {
          console.warn('[BuyNow][debug] handler not called within 12s — possible SDK behavior; check if popup was blocked or handler replaced.')
        }
      }, 12000)

      rzp.open()
    } catch (error) {
      console.error('Payment initialization failed:', error)
      setLoading(false)

      if (error instanceof Error) {
        if (error.message.includes('session')) {
          toast.error('Authentication session expired. Please sign in again.')
          setShowAuthModal(true)
          setAuthPromptShown(true)
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again.')
        } else {
          toast.error(`Payment initialization failed: ${error.message}`)
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Buy Now</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex items-center mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.subname}</p>
              <p className="text-green-600 font-bold">₹{product.price}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Quantity: 1
            </p>
            <p className="text-sm text-gray-600">
              Total: ₹{product.price}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            console.log('[BuyNow] Auth modal closed manually')
            setShowAuthModal(false)
            setPendingPayment(false)
            setAuthPromptShown(false)
            setLoading(false)
          }}
          onAuthSuccess={async () => {
            console.log('[BuyNow] Auth success callback triggered')
            setShowAuthModal(false)
            setAuthPromptShown(false)

            // Wait a bit for session to propagate, then check if we have a session
            setTimeout(async () => {
              const { data: { session: currentSession } } = await supabase.auth.getSession()
              if (currentSession) {
                console.log('[BuyNow] Session confirmed after auth success')
                setSession(currentSession)
                setPendingPayment(true)
              } else {
                console.log('[BuyNow] No session found after auth success, will wait for auth state change')
                setPendingPayment(true)
              }
            }, 1000)
          }}
        />
      )}
    </>
  )
}