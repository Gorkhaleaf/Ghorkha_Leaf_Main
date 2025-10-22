"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, ShoppingCart, Zap } from "lucide-react"
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
  const [imageError, setImageError] = useState(false)

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

  const getImageSrc = () => {
    if (imageError) return "/placeholder-logo.png"
    return product.image || product.mainImage || "/placeholder-logo.png"
  }

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-brand-green/20 transition-all duration-300 cursor-pointer flex flex-col min-h-[400px] w-full max-w-[280px] mx-auto">
        {/* Image Container - Fixed height */}
        <div 
          className="relative bg-gray-50 h-48 flex-shrink-0"
          onClick={handleProductClick}
        >
          <Image
            src={getImageSrc()}
            alt={product.name || "Product"}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container - Fixed padding */}
        <div className="flex flex-col flex-1 p-3">
          {/* Product Info - Fixed min-height */}
          <div className="flex-1 mb-3 min-h-[100px]" onClick={handleProductClick}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-green transition-colors duration-200 text-sm leading-tight mb-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            {(product.subname || product.subtitle) && (
              <p className="text-gray-500 line-clamp-1 text-xs mb-2">
                {product.subname || product.subtitle}
              </p>
            )}

            {/* Collections/Tags */}
            {product.collections && product.collections.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.collections.slice(0, 1).map((collection: string, index: number) => (
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

          {/* Price Section - Fixed height */}
          <div className="mb-3 min-h-[2rem]">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-brand-green text-base">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-gray-400 line-through text-xs">
                    ₹{product.originalPrice}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed size */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 py-2.5 px-3 text-xs h-10"
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 py-2.5 px-3 text-xs h-10"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Buy</span>
            </button>
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
