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
      couponError,
    } = useCart()
    const [couponCode, setCouponCode] = useState("")
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingPayment, setPendingPayment] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [authPromptShown, setAuthPromptShown] = useState(false);
    const [lastPaymentAttempt, setLastPaymentAttempt] = useState<number>(0);
    const supabase = createClient();
    const { toast: uiToast } = useToast();

  const handleApplyCoupon = () => {
    applyCoupon(couponCode)
  }

  // Initialize session and listen for auth changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Cart] Initial session check:', !!session);
      setSession(session);
    };
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Cart] Auth state changed:', event, !!session, session?.user?.id);
      if (event === 'SIGNED_IN' && session) {
        console.log('[Cart] User signed in, updating session state');
        setSession(session);
        // Small delay to ensure session is fully propagated
        setTimeout(() => {
          console.log('[Cart] Session state updated after sign in');
        }, 100);
      } else if (event === 'SIGNED_OUT') {
        console.log('[Cart] User signed out');
        setSession(null);
        setPendingPayment(false);
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
    if (session && pendingPayment && !showAuthModal && !loading) {
      console.log('[Cart] Session available, proceeding with pending payment');
      setPendingPayment(false);
      // Small delay to ensure everything is ready
      setTimeout(() => {
        handlePayment();
      }, 500);
    }
  }, [session, pendingPayment, showAuthModal, loading]);

  const handlePayment = useCallback(async () => {
    console.log('[Cart] handlePayment called');
    console.log('[Cart] Session exists:', !!session);
    console.log('[Cart] Session user:', session?.user?.id);

    const now = Date.now();
    const timeSinceLastAttempt = now - lastPaymentAttempt;

    // Prevent multiple rapid payment attempts (debounce for 2 seconds)
    if (timeSinceLastAttempt < 2000) {
      console.log('[Cart] Payment attempt too soon, debouncing');
      return;
    }

    // Prevent multiple simultaneous payment attempts
    if (loading || paymentCompleted) {
      console.log('[Cart] Payment already in progress or completed');
      return;
    }

    setLastPaymentAttempt(now);
    setLoading(true);

    // Double-check session in case it wasn't updated yet
    if (!session) {
      console.log('[Cart] No session found, checking again...');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('[Cart] Re-checked session:', !!currentSession);

      if (!currentSession) {
        if (!authPromptShown) {
          console.log('[Cart] Still no session, showing auth modal');
          setLoading(false);
          setShowAuthModal(true);
          setPendingPayment(true);
          setAuthPromptShown(true);
          toast.info("Please sign in to proceed with your order", {
            description: "You'll be redirected back to checkout after signing in."
          });
        } else {
          console.log('[Cart] Auth modal already shown, waiting for user action');
          setLoading(false);
          toast.error("Please sign in to complete your purchase", {
            description: "Authentication is required to proceed with checkout."
          });
        }
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
        setLoading(false);
        return;
      }

      if (!profile || !profile.address_line_1 || !profile.city || !profile.state || !profile.pincode) {
        uiToast({
          title: "Address Required",
          description: "Please add your complete address in your profile for seamless delivery.",
          variant: "destructive",
          action: <ToastAction altText="Update Address" onClick={() => window.location.href = '/account'}>Update Address</ToastAction>
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('[Cart] Error checking address:', error);
      toast.error("Unable to verify your address. Please try again.");
      setLoading(false);
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

      console.log('[Cart] Payment flow - Cart summary:', {
        itemCount: currentCart.length,
        items: currentCart.map(item => ({
          name: item.name,
          price: item.calculatedPrice || item.price,
          quantity: item.quantity,
          subtotal: (item.calculatedPrice || item.price) * item.quantity
        })),
        totalPrice: currentTotal,
        totalInPaise: currentTotal * 100
      });

      // Validate amount is reasonable
      if (!currentTotal || currentTotal < 1) {
        console.error('[Cart] CRITICAL: Invalid total amount:', currentTotal);
        uiToast({
          variant: "destructive",
          title: "Payment Error",
          description: "Cart total is invalid. Please refresh and try again.",
        });
        setLoading(false);
        return;
      }

      // Create Razorpay order on server — amount should be in rupees (API will convert to paise)
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).access_token}`,
        },
        body: JSON.stringify({
          amount: currentTotal, // Send as whole rupees, API will multiply by 100 for paise
          currency: 'INR',
          items: currentCart,
          user_id: session!.user.id
        }),
      });

      if (!response.ok) {
        console.error('[Cart] Failed to create Razorpay order:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('[Cart] Error details:', errorData);
        uiToast({
          variant: "destructive",
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
        });
        setLoading(false);
        return;
      }

      const order = await response.json();
      console.log('[Cart] Razorpay order created:', order);
      console.log('[Cart] Order amount from API (in paise):', order.amount);
      console.log('[Cart] Order amount in rupees:', order.amount / 100);
      console.log('[Cart] Expected amount in rupees:', currentTotal);

      // Validate the order amount matches our cart total
      const orderAmountInRupees = order.amount / 100;
      if (Math.abs(orderAmountInRupees - currentTotal) > 1) {
        console.error('[Cart] CRITICAL: Order amount mismatch!', {
          expected: currentTotal,
          received: orderAmountInRupees,
          difference: Math.abs(orderAmountInRupees - currentTotal)
        });
      }

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
      setLoading(false);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('session')) {
          toast.error('Authentication session expired. Please sign in again.');
          setShowAuthModal(true);
          setAuthPromptShown(true);
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again.');
        } else {
          toast.error(`Payment initialization failed: ${error.message}`);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  }, [session, cartItems, subtotal, shippingFee, comboDiscount, couponDiscount, totalPrice]);
 
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = subtotal < 600 ? 30 : 0;
  const comboDiscount = subtotal >= 999 ? subtotal * 0.05 : 0;
  // Placeholder for future coupon logic
  // cart totals used in UI and payment
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = subtotal < 600 ? 30 : 0;
  const comboDiscount = subtotal >= 999 ? subtotal * 0.05 : 0;
  const couponDiscount = 0; // or your real coupon logic
  const totalPrice = subtotal + shippingFee - comboDiscount - couponDiscount; 

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
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          ₹{(item.calculatedPrice || item.price).toFixed(2)}
                        </p>
                        {item.selectedWeight && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.selectedWeight}</p>
                        )}
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
                        <p className="font-semibold">
                          ₹{((item.calculatedPrice || item.price) * item.quantity).toFixed(2)}
                        </p>
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
                      <div>
                        <p className="text-sm">{item.name}</p>
                        {item.selectedWeight && (
                          <p className="text-xs text-gray-500 mt-1">{item.selectedWeight}</p>
                        )}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ₹{(item.calculatedPrice || item.price).toFixed(2)}
                    </div>
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
                    <div className="font-semibold">
                      ₹{((item.calculatedPrice || item.price) * item.quantity).toFixed(2)}
                    </div>
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
              <p className="text-base lg:text-lg font-bold">Combo Savings + Extra 5% OFF on orders above ₹999 </p>
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
                {comboDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm lg:text-base">Combo Discount (5%)</span>
                    <span className="font-semibold text-sm lg:text-base">- ₹{comboDiscount.toFixed(2)}</span>
                  </div>
                )}
                {/* Coupon Discount (if applied) */}
                  {couponDiscount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span className="text-sm lg:text-base">Coupon Discount</span>
                  <span className="font-semibold text-sm lg:text-base">- ₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}  
                {/* Shipping Fee (for subtotal < 600) */}
                  {shippingFee > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span className="text-sm lg:text-base">Shipping Fee</span>
                      <span className="font-semibold text-sm lg:text-base">+ ₹{shippingFee}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-base lg:text-lg border-t pt-3 lg:pt-4">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  (Incl. of all taxes)
                </p>
                {/* Hidden for now - will be used later:
                <p className="text-xs text-gray-500">
                  (includes ₹{(totalPrice * 0.025).toFixed(2)} 2.5% CGST, ₹
                  {(totalPrice * 0.025).toFixed(2)} 2.5% SGST)
                </p>
                */}
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
        <AuthModal onClose={() => {
          console.log('[Cart] Auth modal closed manually');
          setShowAuthModal(false);
          setPendingPayment(false); // Cancel pending payment if user closes modal
          setAuthPromptShown(false); // Reset auth prompt state
          setLoading(false); // Reset loading state
        }} onAuthSuccess={async () => {
          console.log('[Cart] Auth success callback triggered');
          setShowAuthModal(false);
          setAuthPromptShown(false); // Reset auth prompt state

          // Wait a bit for session to propagate, then check if we have a session
          setTimeout(async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (currentSession) {
              console.log('[Cart] Session confirmed after auth success');
              setSession(currentSession);
              setPendingPayment(true); // Mark that payment should proceed
            } else {
              console.log('[Cart] No session found after auth success, will wait for auth state change');
              setPendingPayment(true); // Still set pending in case session comes later
            }
          }, 1000);
        }} />
      )}
    </div>
  )
}
