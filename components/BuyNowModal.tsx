"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Product } from "@/lib/products"
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import AuthModal from '@/components/AuthModal/AuthModal'
import { toast } from "sonner"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Zap } from "lucide-react"

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
  const [mounted, setMounted] = useState(false)
  const [addressWarning, setAddressWarning] = useState<string | null>(null)
  const supabase = createClient()
  const { toast: uiToast } = useToast()

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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
        setAddressWarning("Please add your complete address in your profile for seamless delivery.")
        setLoading(false)
        return
      }

      // Clear address warning if address is complete
      setAddressWarning(null)
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

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null

  const modalContent = (
    <>
      {/* Full Screen Overlay with Translucent Background */}
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
        style={{ 
          zIndex: 99999,
          position: 'fixed',
          width: '100vw',
          height: '100vh'
        }}
      >
        {!showAuthModal ? (
          // Full Screen Product Card - Replica of Mobile Product Card but Larger
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all w-full max-w-[280px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
            
            {/* Close Button - Top Right */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-[10000] bg-white/95 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-200"
            >
              ×
            </button>

            {/* Product Image - Same height and styling as mobile cards but larger */}
            <div className="relative bg-gray-50 h-48 flex-shrink-0">
              <img
                src={product.image || product.mainImage || "/placeholder-logo.png"}
                alt={product.name || "Product"}
                className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
              />
              
              {/* Organic Badge - consistent with mobile cards */}
              {product.isOrganic && (
                <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Organic
                </div>
              )}

              {/* Buy Now Badge */}
              <div className="absolute top-3 right-12 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Buy Now
              </div>
            </div>

            {/* Content Container - Same structure as mobile cards but with more spacing */}
            <div className="flex flex-col flex-1 p-4">
              
              {/* Product Info - Matching mobile card layout */}
              <div className="flex-1 mb-4">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>
                
                {(product.subname || product.subtitle) && (
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2 min-h-[1.5rem]">
                    {product.subname || product.subtitle}
                  </p>
                )}

                {/* Collections/Tags - Same as mobile cards */}
                {product.collections && product.collections.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.collections.slice(0, 2).map((collection: string, index: number) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-600 rounded-full text-xs px-2 py-1"
                      >
                        {collection}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Section - Same styling as mobile cards but larger */}
              <div className="mb-4 min-h-[2rem]">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-brand-green text-xl">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                        Save ₹{product.originalPrice - product.price}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Order Details - Enhanced for full screen */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-brand-green text-base">₹{product.price}</span>
                </div>
              </div>

              {/* Address Warning - Show when address is incomplete */}
              {addressWarning && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-red-800 font-semibold text-sm mb-1">Address Required</h4>
                      <p className="text-red-700 text-xs mb-2">{addressWarning}</p>
                      <button
                        onClick={() => {
                          window.location.href = '/account'
                          onClose()
                        }}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Update Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - Same styling as mobile cards but larger */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 py-3 px-4 text-sm"
                  disabled={loading}
                >
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handlePayment}
                  disabled={loading || addressWarning !== null}
                  className={`flex-1 rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 py-3 px-4 text-sm disabled:opacity-50 ${
                    addressWarning 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>
                    {loading ? 'Processing...' : addressWarning ? 'Address Required' : 'Pay Now'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Login Required - Full Screen Card Design
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl transition-all w-full max-w-[280px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button
              onClick={() => {
                // Just close the entire modal when in login required state
                onClose()
              }}
              className="absolute top-2 right-2 z-[10000] bg-white/95 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-200"
            >
              ×
            </button>

            {/* Product Image - Dimmed for login state */}
            <div className="relative bg-gray-50 h-48 flex-shrink-0 opacity-60">
              <img
                src={product.image || product.mainImage || "/placeholder-logo.png"}
                alt={product.name || "Product"}
                className="w-full h-full object-contain p-3"
              />
              
              {/* Login Required Badge */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-red-500 text-white text-sm font-semibold px-3 py-2 rounded-full">
                  Login Required
                </div>
              </div>
            </div>

            {/* Content Container - Login focused */}
            <div className="flex flex-col flex-1 p-4">
              
              {/* Product Info - Compact */}
              <div className="mb-4 text-center">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {product.name}
                </h3>
                <p className="text-brand-green font-bold text-lg">₹{product.price}</p>
              </div>

              {/* Login Message */}
              <div className="mb-4 text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Please sign in to complete your purchase
                </p>
                <p className="text-gray-500 text-xs">
                  Quick and secure checkout after login
                </p>
              </div>

              {/* Action Buttons - Login focused */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    console.log('[BuyNow] Opening auth modal for login')
                    // Enable the auth modal to show the actual login form
                    setShowAuthModal(true)
                  }}
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-lg font-medium py-3 px-4 text-sm transition-all duration-200 active:scale-95"
                >
                  Sign In / Sign Up
                </button>
                
                <button
                  onClick={() => {
                    // Go back to the buy now modal instead of closing everything
                    setShowAuthModal(false)
                    setPendingPayment(false)
                    setAuthPromptShown(false)
                    setLoading(false)
                    // Don't close the entire modal, just reset to buy now state
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium py-3 px-4 text-sm transition-all duration-200 active:scale-95"
                >
                  Back to Buy Now
                </button>
              </div>

              {/* Quick Benefits */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span>✓ Fast Checkout</span>
                  <span>✓ Order Tracking</span>
                  <span>✓ Rewards</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </>
  )

  // Use portal to render modal at document body level
  return (
    <>
      {createPortal(modalContent, document.body)}
      {showAuthModal && createPortal(
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ 
            zIndex: 100000,
            position: 'fixed',
            width: '100vw',
            height: '100vh'
          }}
        >
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
        </div>,
        document.body
      )}
    </>
  )
}