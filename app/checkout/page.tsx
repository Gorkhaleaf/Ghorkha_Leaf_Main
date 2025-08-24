"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import AuthModal from '@/components/AuthModal/AuthModal';
import { useCart } from '@/context/CartContext';
import type { Session } from '@supabase/supabase-js';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const supabase = createClient();
  const { cartItems, totalPrice } = useCart();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);

  const handlePayment = useCallback(async () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      // Fetch user profile data to get real customer information
      console.log('[Checkout] Fetching user profile for user ID:', session.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', session.user.id)
        .single();

      console.log('[Checkout] Profile fetch result:', {
        hasProfile: !!profile,
        profileEmail: profile?.email,
        profilePhone: profile?.phone,
        error: profileError?.message
      });

      if (profileError) {
        console.error('[Checkout] Could not fetch user profile:', profileError);
        console.log('[Checkout] Will fallback to session user data');
      }

      // Log session user data as fallback
      console.log('[Checkout] Session user data:', {
        sessionEmail: session.user.email,
        sessionPhone: session.user.phone,
        userMetadata: session.user.user_metadata
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
          amount: currentTotal * 100, // Convert to paise
          currency: 'INR',
          items: currentCart,
          user_id: session.user.id
        }),
      });

      const order = await response.json();
      console.log('Razorpay order created:', order);

      const handlerCalled = { called: false };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Gorkha Leaf',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response: any) {
          handlerCalled.called = true;
          try {
            // Razorpay provides payment response when payment completes successfully.
            // Log it (browser console) and also POST a debug confirmation to server.
            console.log('Razorpay payment response:', response);
            console.log('[Checkout][handler] immediate handler entry', { maskedPaymentId: response?.razorpay_payment_id ? String(response.razorpay_payment_id).slice(0,8)+'...' : null });

            // Prepare customer data with detailed logging
            const customerEmail = profile?.email || session.user.email;
            const customerPhone = profile?.phone || session.user.phone;

            console.log('[Checkout] Prepared customer data:', {
              customerEmail,
              customerPhone,
              source: profile?.email ? 'profile' : 'session',
              isValidEmail: customerEmail && customerEmail !== 'customer@example.com',
              isValidPhone: customerPhone && customerPhone !== '+919999999999'
            });

            // Validate customer data before sending
            if (!customerEmail || customerEmail === 'customer@example.com') {
              console.error('[Checkout] CRITICAL: Invalid or missing customer email:', customerEmail);
            }
            if (!customerPhone || customerPhone === '+919999999999') {
              console.error('[Checkout] CRITICAL: Invalid or missing customer phone:', customerPhone);
            }

            // Save order via API update (mark success). We send razorpay ids so webhook / server can reconcile.
            const saveBody = {
              user_id: session.user.id,
              amount: currentTotal,
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

            console.log('[Checkout] Final saveBody customer data:', {
              customer_email: saveBody.customer_email,
              customer_phone: saveBody.customer_phone
            });

            // Log what we're about to send (mask access token)
            const masked = (session as any).access_token ? `${String((session as any).access_token).slice(0,10)}...` : null;
            console.log('[Checkout] saving order to /api/orders, user:', session.user.id, 'accessToken(masked):', masked, 'body:', {
              amount: saveBody.amount,
              itemsCount: Array.isArray(saveBody.items) ? saveBody.items.length : undefined,
              razorpay_payment_id: !!saveBody.razorpay_payment_id
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

            console.log('[Checkout] /api/orders response.status', saveResponse.status);
            const respText = await saveResponse.text();
            let respJson = null;
            try {
              respJson = respText ? JSON.parse(respText) : null;
            } catch (e) {
              console.error('[Checkout] failed to parse /api/orders response', e, 'body:', respText);
            }

            if (saveResponse.ok) {
              console.log('Order saved successfully via API', respJson);
            } else {
              console.error('Order save failed via API:', saveResponse.status, respJson);
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
              console.log('[Checkout][debug] /api/debug/save-order', debugResp.status, debugJson);
            } catch (e) {
              console.error('[Checkout][debug] failed to POST /api/debug/save-order', e);
            }

          } catch (error) {
            console.error('Order save error:', error);
          }
        },
        prefill: {
          name: profile?.full_name || session.user.user_metadata?.full_name || 'Customer',
          email: profile?.email || session.user.email || '',
          contact: profile?.phone || session.user.phone || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      console.log('[Checkout][debug] Razorpay options prepared (order.id):', order.id);
      console.log('[Checkout][debug] Attaching handler and opening Razorpay modal...');

      const rzp = new (window as any).Razorpay(options);

      // Attach explicit success/failure listeners for additional confirmation logging
      rzp.on('payment.failed', function (resp: any) {
        console.error('Razorpay payment failed event:', resp);
      });
      rzp.on('payment.success', function (resp: any) {
        // Not all Razorpay SDKs emit this; handler above is the canonical success callback.
        console.log('Razorpay payment.success event:', resp);
      });

      // Watchdog: if handler not invoked within 12s, log a warning to help debugging
      setTimeout(() => {
        if (!handlerCalled.called) {
          console.warn('[Checkout][debug] handler not called within 12s — possible SDK behavior; check if popup was blocked or handler replaced.');
        }
      }, 12000);

      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
    } finally {
      setLoading(false);
    }
  }, [session, cartItems, totalPrice]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    handlePayment();
  }, [handlePayment]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay with Razorpay'}
        </button>
      </div>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default CheckoutPage;