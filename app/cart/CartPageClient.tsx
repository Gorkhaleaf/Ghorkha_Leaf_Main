"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { createClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import AuthModal from "@/components/AuthModal/AuthModal";

export default function CartPage() {

  // ------------------------------------------
  // ✅ SAFE SUPABASE CLIENT INITIALIZATION
  // ------------------------------------------
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const client = createClient();
    setSupabase(client);
  }, []);
  // ------------------------------------------

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    couponError,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [authPromptShown, setAuthPromptShown] = useState(false);
  const [lastPaymentAttempt, setLastPaymentAttempt] = useState<number>(0);

  const { toast: uiToast } = useToast();

  const handleApplyCoupon = () => {
    applyCoupon(couponCode);
  };

  // -------------------------------------------------
  // 🔒 WAIT UNTIL SUPABASE CLIENT IS READY
  // -------------------------------------------------
  useEffect(() => {
    if (!supabase) return;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setSession(session);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setPendingPayment(false);
        } else {
          setSession(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // AUTO-PAY AFTER LOGIN
  useEffect(() => {
    if (session && pendingPayment && !showAuthModal && !loading) {
      setPendingPayment(false);
      setTimeout(() => handlePayment(), 500);
    }
  }, [session, pendingPayment, showAuthModal, loading]);

  // -------------------------------------------------------
  // PAYMENT HANDLER (UNCHANGED — ONLY SUPABASE GUARDED)
  // -------------------------------------------------------
  const handlePayment = useCallback(async () => {
    if (!supabase) return; // Protect Supabase calls

    const now = Date.now();
    const timeSinceLastAttempt = now - lastPaymentAttempt;

    if (timeSinceLastAttempt < 2000) return;
    if (loading || paymentCompleted) return;

    setLastPaymentAttempt(now);
    setLoading(true);

    if (!session) {
      const { data: { session: currentSession } } =
        await supabase.auth.getSession();

      if (!currentSession) {
        if (!authPromptShown) {
          setLoading(false);
          setShowAuthModal(true);
          setPendingPayment(true);
          setAuthPromptShown(true);

          toast.info("Please sign in to proceed with your order", {
            description:
              "You'll be redirected back to checkout after signing in.",
          });
        } else {
          setLoading(false);
          toast.error("Please sign in to complete your purchase");
        }
        return;
      }

      setSession(currentSession);
    }

    if (totalPrice === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }

    // -------------------------------------------------
    // ADDRESS VERIFICATION (UNCHANGED)
    // -------------------------------------------------
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("address_line_1, city, state, pincode")
        .eq("id", session!.user.id)
        .maybeSingle();

      if (
        !profile ||
        !profile.address_line_1 ||
        !profile.city ||
        !profile.state ||
        !profile.pincode
      ) {
        uiToast({
          title: "Address Required",
          description:
            "Please add your complete address in your profile for seamless delivery.",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Update Address"
              onClick={() => (window.location.href = "/account")}
            >
              Update Address
            </ToastAction>
          ),
        });

        setLoading(false);
        return;
      }
    } catch (err) {
      toast.error("Unable to verify your address. Please try again.");
      setLoading(false);
      return;
    }

    // -------------------------------------------------
    // FETCH CUSTOMER PROFILE (UNCHANGED)
    // -------------------------------------------------
    let profile: any = null;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", session!.user.id)
        .maybeSingle();

      profile = data;
    } catch {}

    const currentCart = [...cartItems];
    const currentTotal = totalPrice;

    if (!currentTotal || currentTotal < 1) {
      uiToast({
        variant: "destructive",
        title: "Payment Error",
        description: "Cart total is invalid. Please refresh and try again.",
      });
      setLoading(false);
      return;
    }

    // -------------------------------------------------
    // CREATE RAZORPAY ORDER (UNCHANGED)
    // -------------------------------------------------
    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(session as any).access_token}`,
      },
      body: JSON.stringify({
        amount: currentTotal,
        currency: "INR",
        items: currentCart,
        user_id: session!.user.id,
      }),
    });

    if (!response.ok) {
      uiToast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
      });
      setLoading(false);
      return;
    }

    const order = await response.json();

    const rzp = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Gorkha Leaf",
      description: "Tea Purchase",
      order_id: order.id,
      handler: async function (response: any) {
        const saveBody = {
          user_id: session!.user.id,
          amount: currentTotal,
          currency: "INR",
          items: currentCart,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          status: "success",
          customer_email: profile?.email || session!.user.email,
          customer_phone: profile?.phone || session!.user.phone,
        };

        await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).access_token}`,
          },
          body: JSON.stringify(saveBody),
        });

        toast.success("Payment successful! Thank you for your order.");
        setPaymentCompleted(true);
        setLoading(false);

        setTimeout(() => {
          window.location.href = "/account/orders";
        }, 1500);
      },
    });

    rzp.open();
  }, [
    supabase,
    session,
    cartItems,
    lastPaymentAttempt,
    loading,
    paymentCompleted,
    authPromptShown,
  ]);

  // ----------------------------------------
  // CART TOTALS (UNCHANGED)
  // ----------------------------------------
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal < 600 ? 30 : 0;
  const comboDiscount = subtotal >= 999 ? subtotal * 0.05 : 0;
  const couponDiscount = 0;
  const totalPrice =
    subtotal + shippingFee - comboDiscount - couponDiscount;

  // ----------------------------------------
  // BEGIN JSX (YOUR ORIGINAL CONTENT)
  // ----------------------------------------
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
            
            {/* Desktop header */}
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>

                        <p className="text-sm font-semibold text-green-600 mt-1">
                          ₹{(item.calculatedPrice || item.price).toFixed(2)}
                        </p>

                        {item.selectedWeight && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.selectedWeight}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-3 py-1">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="font-semibold">
                          ₹
                          {(
                            (item.calculatedPrice || item.price) *
                            item.quantity
                          ).toFixed(2)}
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div>
                        <p className="text-sm">{item.name}</p>
                        {item.selectedWeight && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.selectedWeight}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="font-semibold">
                      ₹{(item.calculatedPrice || item.price).toFixed(2)}
                    </div>

                    <div>
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="font-semibold">
                      ₹
                      {(
                        (item.calculatedPrice || item.price) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-start lg:justify-between items-center mt-4 lg:mt-6">
              <Button
                variant="outline"
                asChild
                className="text-xs lg:text-sm px-3 lg:px-4 py-2"
              >
                <Link href="/">← CONTINUE SHOPPING</Link>
              </Button>
            </div>

            <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-green-600 text-white rounded-lg border-2 border-dashed border-white">
              <p className="text-base lg:text-lg font-bold">
                Combo Savings + Extra 5% OFF on orders above ₹999{" "}
              </p>

              <p className="text-xs lg:text-sm mt-1">
                Use coupon code:{" "}
                <span className="font-bold">GORKHA10</span>
              </p>
            </div>
          </div>
                      {/* RIGHT SIDE CART TOTALS */}
          <div className="mt-8 lg:mt-0">
            <div className="border rounded-lg p-4 lg:p-6 bg-gray-50">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">
                CART TOTALS
              </h2>

              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm lg:text-base">Subtotal</span>
                  <span className="font-semibold text-sm lg:text-base">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                {comboDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm lg:text-base">
                      Combo Discount (5%)
                    </span>
                    <span className="font-semibold text-sm lg:text-base">
                      - ₹{comboDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span className="text-sm lg:text-base">
                      Coupon Discount
                    </span>
                    <span className="font-semibold text-sm lg:text-base">
                      - ₹{couponDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {shippingFee > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="text-sm lg:text-base">Shipping Fee</span>
                    <span className="font-semibold text-sm lg:text-base">
                      + ₹{shippingFee}
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-base lg:text-lg border-t pt-3 lg:pt-4">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                <p className="text-xs text-gray-500">(Incl. of all taxes)</p>
              </div>

              <Button
                size="lg"
                className="w-full mt-4 lg:mt-6 bg-green-800 hover:bg-green-900 text-sm lg:text-base py-3"
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0 || paymentCompleted}
              >
                {paymentCompleted
                  ? "Payment Completed"
                  : loading
                  ? "Processing..."
                  : "PROCEED TO CHECKOUT"}
              </Button>

              <div className="mt-4 lg:mt-6">
                <h3 className="font-semibold mb-2 text-sm lg:text-base">
                  Coupon
                </h3>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="text-sm"
                  />

                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="text-sm whitespace-nowrap"
                  >
                    Apply coupon
                  </Button>
                </div>

                {couponError && (
                  <p className="text-red-500 text-xs mt-1">{couponError}</p>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4 lg:mt-6">
                Order below Rs 600 will be charged Rs. 30 for shipping for
                Prepaid Payment and Rs. 75 for shipping for Cash On Delivery.
              </p>
            </div>

            {/* PAYMENT ICONS */}
            <div className="flex justify-center items-center flex-wrap gap-3 lg:gap-4 mt-4 lg:mt-6">
              <Image
                src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png"
                alt="Visa"
                width={35}
                height={22}
                className="object-contain"
              />

              <Image
                src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3521564-2944982.png"
                alt="Mastercard"
                width={35}
                height={22}
                className="object-contain"
              />

              <Image
                src="https://cdn.iconscout.com/icon/free/png-256/free-rupay-3521497-2944919.png"
                alt="Rupay"
                width={35}
                height={22}
                className="object-contain"
              />

              <Image
                src="https://cdn.iconscout.com/icon/free/png-256/free-google-pay-2038779-1721670.png"
                alt="GPay"
                width={35}
                height={22}
                className="object-contain"
              />

              <Image
                src="https://cdn.iconscout.com/icon/free/png-256/free-paytm-226444.png"
                alt="Paytm"
                width={35}
                height={22}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setPendingPayment(false);
            setAuthPromptShown(false);
            setLoading(false);
          }}
          onAuthSuccess={async () => {
            setShowAuthModal(false);
            setAuthPromptShown(false);

            setTimeout(async () => {
              if (!supabase) return;
              const { data: { session: currentSession } } =
                await supabase.auth.getSession();

              if (currentSession) {
                setSession(currentSession);
                setPendingPayment(true);
              } else {
                setPendingPayment(true);
              }
            }, 1000);
          }}
        />
      )}
    </div>
  );
}

