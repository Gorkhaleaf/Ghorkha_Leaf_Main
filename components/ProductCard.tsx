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
}

export function ProductCard({ product }: ProductCardProps) {
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

  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative h-48 sm:h-64 md:h-80">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2 cursor-pointer hover:text-green-600 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">{product.subname}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-base sm:text-lg font-bold text-green-600">₹{product.price}</span>
            <span className="text-gray-500 line-through text-sm sm:text-base sm:ml-2">₹{product.originalPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-green-700 transition-colors w-full sm:w-auto"
          >
            {added ? (
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Added</span>
                <span className="sm:hidden">✓</span>
              </div>
            ) : (
              <span className="hidden sm:inline">Add to Cart</span>
            )}
            {!added && <span className="sm:hidden">Add</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
