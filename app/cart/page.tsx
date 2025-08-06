"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

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

  const handleApplyCoupon = () => {
    applyCoupon(couponCode)
  }

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
              <Button size="lg" className="w-full mt-6 bg-green-800 hover:bg-green-900">
                PROCEED TO CHECKOUT
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
              <Image src="/placeholder.svg" alt="Visa" width={40} height={25} />
              <Image src="/placeholder.svg" alt="Mastercard" width={40} height={25} />
              <Image src="/placeholder.svg" alt="Rupay" width={40} height={25} />
              <Image src="/placeholder.svg" alt="GPay" width={40} height={25} />
              <Image src="/placeholder.svg" alt="Paytm" width={40} height={25} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
