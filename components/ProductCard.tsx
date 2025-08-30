"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check } from "lucide-react"
import { Product } from "@/lib/products"
import { useCart } from "@/context/CartContext"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

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
    addToCart({ ...product, quantity: 1 })
    router.push('/cart')
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        compact ? 'min-h-[540px] sm:min-h-0' : 'min-h-[550px] sm:min-h-0'
      }`}
      onClick={handleProductClick}
    >
      <div className={`relative ${compact ? 'h-80 sm:h-48 md:h-64' : 'h-80 sm:h-64 md:h-80'}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className={`p-3 sm:p-3 ${compact ? 'p-2 sm:p-2' : 'p-4 sm:p-4'}`}>
        <h3 className={`font-semibold mb-2 cursor-pointer hover:text-green-600 line-clamp-2 ${
          compact ? 'text-base sm:text-base' : 'text-lg sm:text-lg'
        }`}>
          {product.name}
        </h3>
        <p className={`text-gray-600 mb-2 line-clamp-1 ${
          compact ? 'text-xs sm:text-xs' : 'text-sm sm:text-sm'
        }`}>{product.subname}</p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center">
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
  )
}
