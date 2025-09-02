"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import { BuyNowModal } from "./BuyNowModal"

interface ProductCardProps {
  product: any
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)

  const handleProductClick = () => {
    router.push(`/products/${product.slug}`)
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowBuyNowModal(true)
  }

  return (
    <>
      <div
        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
        onClick={handleProductClick}
      >
        <div className={`relative ${compact ? 'h-80 sm:h-48 md:h-80' : 'h-80 sm:h-64 md:h-96'}`}>
          <Image
            src={product.image || product.mainImage || "/Products/placeholder.png"}
            alt={product.name || "product"}
            fill
            className="object-cover"
          />
        </div>
        <div className={`p-3 sm:p-3 flex flex-col h-full ${compact ? 'p-2 sm:p-2' : 'p-4 sm:p-4'}`}>
          {/* Product Info Section - Fixed height */}
          <div className="flex-none mb-2">
            <h3 className={`font-semibold mb-2 cursor-pointer hover:text-green-600 line-clamp-2 min-h-[3rem] flex items-start ${
              compact ? 'text-base sm:text-base' : 'text-lg sm:text-lg'
            }`}>
              {product.name}
            </h3>
            <p className={`text-gray-600 line-clamp-1 min-h-[1rem] ${
              compact ? 'text-xs sm:text-xs' : 'text-sm sm:text-sm'
            }`}>{product.subname || product.subtitle}</p>
          </div>

          {/* Spacer to push buttons to bottom - reduced by 50% */}
          <div className="h-8"></div>

          {/* Price and Buttons Section - Always at bottom */}
          <div className="flex-none">
            <div className="flex flex-col sm:flex-row sm:items-center mb-2">
              <span className={`font-bold text-green-600 ${
                compact ? 'text-sm sm:text-sm' : 'text-base sm:text-lg'
              }`}>₹{product.price}</span>
              <span className={`text-gray-500 line-through sm:ml-2 ${
                compact ? 'text-xs sm:text-xs' : 'text-sm sm:text-base'
              }`}>₹{product.originalPrice}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
                  compact
                    ? 'px-2 py-1.5 text-xs sm:text-xs'
                    : 'px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base'
                }`}
              >
                {added ? (
                  <div className="flex items-center justify-center">
                    <Check className={`mr-1 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    <span className="hidden sm:inline">Added</span>
                    <span className="sm:hidden">✓</span>
                  </div>
                ) : (
                  <span className="hidden sm:inline">Add to Cart</span>
                )}
                {!added && <span className="sm:hidden">Add</span>}
              </button>
              <button
                onClick={handleBuyNow}
                className={`flex-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors ${
                  compact
                    ? 'px-2 py-1.5 text-xs sm:text-xs'
                    : 'px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base'
                }`}
              >
                <span className="hidden sm:inline">Buy Now</span>
                <span className="sm:hidden">Buy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showBuyNowModal && (
        <BuyNowModal
          product={product}
          onClose={() => setShowBuyNowModal(false)}
        />
      )}
    </>
  )
}
