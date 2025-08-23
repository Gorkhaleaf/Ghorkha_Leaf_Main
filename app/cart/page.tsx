"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"

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

  const handleApplyCoupon = () => {
    applyCoupon(couponCode)
  }

  const handlePayment = async () => {
    if (totalPrice === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order.");
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Gorkha Leaf',
        description: 'Tea Purchase',
        order_id: order.id,
        handler: async function (response: any) {
          const res = await fetch('/api/razorpay', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await res.json();
          if (result.success) {
            toast.success('Payment successful! Thank you for your order.');
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Gorkha Leaf Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Gorkha Leaf Corporate Office',
        },
        theme: {
          color: '#047857',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error("Payment failed. Please try again or use a different payment method.");
      });
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-32">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-green-600">
            SHOPPING CART
          </Link>
          <span className="mx-2">{">"}</span>
          CHECKOUT DETAILS
          <span className="mx-2">{">"}</span>
          ORDER COMPLETE
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="border-b pb-4">
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
                <div key={item.id} className="grid grid-cols-6 gap-4 items-center border-b py-4">
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
              ))
            )}
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" asChild>
                <Link href="/">← CONTINUE SHOPPING</Link>
              </Button>
            </div>
            <div className="mt-8 p-6 bg-green-600 text-white rounded-lg border-2 border-dashed border-white">
              <p className="text-lg font-bold">10% Cart discount</p>
              <p className="text-sm">
                Use coupon code: <span className="font-bold">GORKHA10</span>
              </p>
            </div>
          </div>
          <div>
            <div className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-6">CART TOTALS</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-4">
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
                className="w-full mt-6 bg-green-800 hover:bg-green-900"
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
              </Button>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Coupon</h3>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply coupon
                  </Button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
              </div>
              <p className="text-xs text-gray-500 mt-6">
                Order below Rs 600 will be charged Rs. 30 for shipping for Prepaid Payment and Rs. 75 for
                shipping for Cash On Delivery.
              </p>
            </div>
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png" alt="Visa" width={40} height={25} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3521564-2944982.png" alt="Mastercard" width={40} height={25} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-rupay-3521497-2944919.png" alt="Rupay" width={40} height={25} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-google-pay-2038779-1721670.png" alt="GPay" width={40} height={25} className="object-contain" />
              <Image src="https://cdn.iconscout.com/icon/free/png-256/free-paytm-226444.png" alt="Paytm" width={40} height={25} className="object-contain" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
