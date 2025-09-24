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
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-brand-green/20 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div 
          className={`relative bg-gray-50 ${
            compact ? 'h-40 sm:h-48' : 'h-56 sm:h-64'
          }`}
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
          
          {/* Organic Badge */}
          {product.isOrganic && (
            <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              Organic
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className={`flex flex-col flex-1 ${compact ? 'p-2 sm:p-3' : 'p-4'}`}>
          {/* Product Info */}
          <div className={`flex-1 ${compact ? 'mb-2 sm:mb-4' : 'mb-4'}`} onClick={handleProductClick}>
            <h3 className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-green transition-colors duration-200 ${
              compact ? 'text-xs leading-tight mb-1 sm:mb-2' : 'text-sm leading-tight mb-2'
            }`}>
              {product.name}
            </h3>
            
            {(product.subname || product.subtitle) && (
              <p className={`text-gray-500 line-clamp-1 ${
                compact ? 'text-xs mb-1 sm:mb-2' : 'text-xs mb-3'
              }`}>
                {product.subname || product.subtitle}
              </p>
            )}

            {/* Collections/Tags - Limited for compact mobile */}
            {product.collections && product.collections.length > 0 && (
              <div className={`flex flex-wrap gap-1 ${compact ? 'mb-1 sm:mb-3' : 'mb-3'}`}>
                {product.collections.slice(0, compact ? 1 : 2).map((collection: string, index: number) => (
                  <span 
                    key={index} 
                    className={`bg-gray-100 text-gray-600 rounded-full ${
                      compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-1'
                    }`}
                  >
                    {collection}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className={`${compact ? 'mb-2 sm:mb-4' : 'mb-4'}`}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`font-bold text-brand-green ${
                compact ? 'text-sm sm:text-base' : 'text-lg'
              }`}>
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className={`text-gray-400 line-through ${
                    compact ? 'text-xs' : 'text-sm'
                  }`}>
                    ₹{product.originalPrice}
                  </span>
                  {!compact && (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 ${
                compact 
                  ? 'py-1.5 px-2 text-xs' 
                  : 'py-2.5 px-3 text-[11px]'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3 w-3" />
                  <span className="hidden sm:inline">Added</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleBuyNow}
              className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 ${
                compact 
                  ? 'py-1.5 px-2 text-xs' 
                  : 'py-2.5 px-3 text-[11px]'
              }`}
            >
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Buy Now</span>
              <span className="sm:hidden">Buy</span>
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
