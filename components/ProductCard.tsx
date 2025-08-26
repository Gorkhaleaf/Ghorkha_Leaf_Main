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
      <div className="relative h-80">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:text-green-600">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{product.subname}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">₹{product.price}</span>
            <span className="text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {added ? (
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Added
              </div>
            ) : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}
