"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import AuthModal from '@/components/AuthModal/AuthModal'

export default function CartPage() {
    const {
      cartItems,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      totalPrice,
      discount,
      couponError,
    } = useCart()
    const [couponCode, setCouponCode] = useState("")
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingPayment, setPendingPayment] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const supabase = createClient();
    const { toast: uiToast } = useToast();

  const handleApplyCoupon = () => {
    applyCoupon(couponCode)
  }

  // Initialize session and listen for auth changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Cart] Auth state changed:', event, !!session);
      if (event === 'SIGNED_IN' && session) {
        console.log('[Cart] User signed in, refreshing session...');
        // Force refresh the session to ensure we have the latest data
        const { data: { session: refreshedSession } } = await supabase.auth.getSession();
        setSession(refreshedSession || session);
      } else {
        setSession(session);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auto-proceed with payment when session becomes available after login
  useEffect(() => {
    if (session && pendingPayment && !showAuthModal) {
      console.log('[Cart] Session available, proceeding with pending payment');
      setPendingPayment(false);
      handlePayment();
    }
  }, [session, pendingPayment, showAuthModal]);

  const handlePayment = useCallback(async () => {
    console.log('[Cart] handlePayment called');
    console.log('[Cart] Session exists:', !!session);
    console.log('[Cart] Session user:', session?.user?.id);
    setPendingPayment(false); // Reset pending payment flag

    // Double-check session in case it wasn't updated yet
    if (!session) {
      console.log('[Cart] No session found, checking again...');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('[Cart] Re-checked session:', !!currentSession);

      if (!currentSession) {
        console.log('[Cart] Still no session, showing auth modal');
        setShowAuthModal(true);
        setPendingPayment(true);
        return;
      }

      // Update session state if we found one
      setSession(currentSession);
      console.log('[Cart] Session updated from re-check');
    }

    if (totalPrice === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }

    // Check if address is complete for seamless delivery
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('address_line_1, city, state, pincode')
        .eq('id', session!.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('[Cart] Could not fetch user profile for address check:', profileError);
        toast.error("Unable to verify your address. Please try again.");
        return;
      }

      if (!profile || !profile.address_line_1 || !profile.city || !profile.state || !profile.pincode) {
        uiToast({
          title: "Address Required",
          description: "Please add your complete address in your profile for seamless delivery.",
          variant: "destructive",
          action: <ToastAction altText="Update Address" onClick={() => window.location.href = '/account'}>Update Address</ToastAction>
        });
        return;
      }
    } catch (error) {
      console.error('[Cart] Error checking address:', error);
      toast.error("Unable to verify your address. Please try again.");
      return;
    }

    console.log('[Cart] Session user:', session!.user);
    console.log('[Cart] Session user ID:', session!.user.id);
    console.log('[Cart] Session user email:', session!.user.email);

    setLoading(true);
    try {
      // Fetch user profile data to get real customer information
      console.log('[Cart] Fetching user profile for user ID:', session!.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', session!.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error

      console.log('[Cart] Profile fetch result:', {
        hasProfile: !!profile,
        profileEmail: profile?.email,
        profilePhone: profile?.phone,
        error: profileError?.message
      });

      if (profileError) {
        console.error('[Cart] Could not fetch user profile:', profileError);
        console.log('[Cart] Will fallback to session user data');
      }

      // Log session user data as fallback
      console.log('[Cart] Session user data:', {
        sessionEmail: session!.user.email,
        sessionPhone: session!.user.phone,
        userMetadata: session!.user.user_metadata
      });

      // Capture current cart state
      const currentCart = [...cartItems];
      const currentTotal = totalPrice;

      // Create Razorpay order on server — include items and user_id so server can pre-create pending order
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).access_token}`,
        },
        body: JSON.stringify({
          amount: Math.round(currentTotal), // Send as whole rupees, no paise conversion
          currency: 'INR',
          items: currentCart,
          user_id: session!.user.id
        }),
      });

      const order = await response.json();
      console.log('Razorpay order created:', order);
      console.log('[Cart] Order amount from API:', order.amount, 'rupees');
      console.log('[Cart] Expected display amount:', order.amount, 'rupees');

      const handlerCalled = { called: false };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount, // This should be in paise (299600)
        currency: order.currency,
        name: 'Gorkha Leaf',
        description: 'Tea Purchase',
        order_id: order.id,
        handler: async function (response: any) {
          handlerCalled.called = true;
          try {
            // Razorpay provides payment response when payment completes successfully.
            // Log it (browser console) and also POST a debug confirmation to server.
            console.log('Razorpay payment response:', response);
            console.log('[Cart][handler] immediate handler entry', { maskedPaymentId: response?.razorpay_payment_id ? String(response.razorpay_payment_id).slice(0,8)+'...' : null });

            // Prepare customer data with detailed logging
            const customerEmail = profile?.email || session!.user.email;
            const customerPhone = profile?.phone || session!.user.phone;

            console.log('[Cart] Prepared customer data:', {
              customerEmail,
              customerPhone,
              source: profile?.email ? 'profile' : 'session',
              isValidEmail: customerEmail && customerEmail !== 'customer@example.com',
              isValidPhone: customerPhone && customerPhone !== '+919999999999'
            });

            // Validate customer data before sending
            if (!customerEmail || customerEmail === 'customer@example.com') {
              console.error('[Cart] CRITICAL: Invalid or missing customer email:', customerEmail);
            }
            if (!customerPhone || customerPhone === '+919999999999') {
              console.error('[Cart] CRITICAL: Invalid or missing customer phone:', customerPhone);
            }

            // Save order via API update (mark success). We send razorpay ids so webhook / server can reconcile.
            const saveBody = {
              user_id: session!.user.id,
              amount: currentTotal, // Keep as rupees for database (no paise conversion)
              currency: 'INR',
              items: currentCart,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: 'success',
              // Include customer information from profile
              customer_email: customerEmail,
              customer_phone: customerPhone
            };

            console.log('[Cart] Final saveBody customer data:', {
              customer_email: saveBody.customer_email,
              customer_phone: saveBody.customer_phone
            });

            const saveResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(session as any).access_token}`
              },
              credentials: 'include',
              body: JSON.stringify(saveBody)
            });

            console.log('[Cart] /api/orders response.status', saveResponse.status);
            const respText = await saveResponse.text();
            let respJson = null;
            try {
              respJson = respText ? JSON.parse(respText) : null;
            } catch (e) {
              console.error('[Cart] failed to parse /api/orders response', e, 'body:', respText);
            }

            if (saveResponse.ok) {
                console.log('Order saved successfully via API', respJson);
                toast.success('Payment successful! Thank you for your order.');
                toast.success('You will receive a confirmation call from our team shortly to finalize your order details.', {
                  description: 'Our team will contact you within 24 hours.'
                });
                setPaymentCompleted(true);
                // Reset loading state
                setLoading(false);
                // Optionally redirect to orders page after a delay
                setTimeout(() => {
                  window.location.href = '/account/orders';
                }, 2000);
             } else {
               console.error('Order save failed via API:', saveResponse.status, respJson);
               toast.error('Payment verification failed. Please contact support.');
             }

            // Send the same payload to debug endpoint for detailed server logging
            try {
              const debugResp = await fetch('/api/debug/save-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${(session as any).access_token}`
                },
                body: JSON.stringify(saveBody)
              });
              const debugJson = await debugResp.json();
              console.log('[Cart][debug] /api/debug/save-order', debugResp.status, debugJson);
            } catch (e) {
              console.error('[Cart][debug] failed to POST /api/debug/save-order', e);
            }

          } catch (error) {
            console.error('Order save error:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
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
      };

      console.log('[Cart][debug] Razorpay order details:', {
        orderId: order.id,
        orderAmount: order.amount,
        orderCurrency: order.currency,
        sentAmount: Math.round(currentTotal),
        expectedDisplayAmount: Math.round(currentTotal)
      });
      console.log('[Cart][debug] Razorpay options prepared (order.id):', order.id);
      console.log('[Cart][debug] Attaching handler and opening Razorpay modal...');

      const rzp = new (window as any).Razorpay(options);

      // Attach explicit success/failure listeners for additional confirmation logging
      rzp.on('payment.failed', function (resp: any) {
        console.error('Razorpay payment failed event:', resp);
        toast.error("Payment failed. Please try again or use a different payment method.");
      });
      rzp.on('payment.success', function (resp: any) {
        // Not all Razorpay SDKs emit this; handler above is the canonical success callback.
        console.log('Razorpay payment.success event:', resp);
      });

      // Watchdog: if handler not invoked within 12s, log a warning to help debugging
      setTimeout(() => {
        if (!handlerCalled.called) {
          console.warn('[Cart][debug] handler not called within 12s — possible SDK behavior; check if popup was blocked or handler replaced.');
        }
      }, 12000);

      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [session, cartItems, totalPrice]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8 lg:py-12 pt-24 lg:pt-32">
        <div className="text-xs lg:text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-green-600">
            SHOPPING CART
          </Link>
          <span className="mx-1 lg:mx-2">{">"}</span>
          CHECKOUT DETAILS
          <span className="mx-1 lg:mx-2">{">"}</span>
          ORDER COMPLETE
        </div>
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
          <div className="lg:col-span-2">
            {/* Desktop header - hidden on mobile */}
            <div className="hidden md:block border-b pb-4">
              <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-600">
                <div className="col-span-3">PRODUCT</div>
                <div>PRICE</div>
                <div>QUANTITY</div>
                <div>SUBTOTAL</div>
              </div>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="border-b py-4">
                  {/* Mobile layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 mt-1"
                      >
                        <X size={16} />
                      </button>
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                      <div className="relative w-20 h-20">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <p className="text-sm">{item.name}</p>
                    </div>
                    <div className="font-semibold">₹{item.price.toFixed(2)}</div>
                    <div>
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-start lg:justify-between items-center mt-4 lg:mt-6">
              <Button variant="outline" asChild className="text-xs lg:text-sm px-3 lg:px-4 py-2">
                <Link href="/">← CONTINUE SHOPPING</Link>
              </Button>
            </div>
            <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-600 text-white rounded-lg border-2 border-dashed border-white">
              <p className="text-base lg:text-lg font-bold">10% Cart discount</p>
              <p className="text-xs lg:text-sm mt-1">
                Use coupon code: <span className="font-bold">GORKHA10</span>
              </p>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="border rounded-lg p-4 lg:p-6 bg-gray-50">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">CART TOTALS</h2>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm lg:text-base">Subtotal</span>
                  <span className="font-semibold text-sm lg:text-base">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm lg:text-base">Discount</span>
                    <span className="font-semibold text-sm lg:text-base">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base lg:text-lg border-t pt-3 lg:pt-4">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  (includes ₹{(totalPrice * 0.025).toFixed(2)} 2.5% CGST, ₹
                  {(totalPrice * 0.025).toFixed(2)} 2.5% SGST)
                </p>
              </div>
              <Button
                size="lg"
                className="w-full mt-4 lg:mt-6 bg-green-800 hover:bg-green-900 text-sm lg:text-base py-3"
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0 || paymentCompleted}
              >
                {paymentCompleted ? 'Payment Completed' : loading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
              </Button>
              <div className="mt-4 lg:mt-6">
                <h3 className="font-semibold mb-2 text-sm lg:text-base">Coupon</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-sm"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon} className="text-sm whitespace-nowrap">
                    Apply coupon
                  </Button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
              </div>
              <p className="text-xs text-gray-500 mt-4 lg:mt-6">
                Order below Rs 600 will be charged Rs. 30 for shipping for Prepaid Payment and Rs. 75 for
                shipping for Cash On Delivery.
              </p>
            </div>
            <div className="flex justify-center items-center flex-wrap gap-3 lg:gap-4 mt-4 lg:mt-6">
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png" alt="Visa" width={35} height={22} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3521564-2944982.png" alt="Mastercard" width={35} height={22} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-rupay-3521497-2944919.png" alt="Rupay" width={35} height={22} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-google-pay-2038779-1721670.png" alt="GPay" width={35} height={22} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-paytm-226444.png" alt="Paytm" width={35} height={22} className="object-contain" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={() => {
          console.log('[Cart] Auth success, closing modal');
          setShowAuthModal(false);
          setPendingPayment(true); // Mark that payment should proceed once session is available
        }} />
      )}
    </div>
  )
}
