"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check } from "lucide-react"
import { Product } from "@/lib/products"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    addToCart({ ...product, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group relative overflow-hidden cursor-pointer transition-all duration-300">
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden h-80">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="w-full h-full object-contain transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <Button
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white py-2 px-4 text-base sm:py-3 sm:px-6 sm:text-lg"
              style={{ backgroundColor: '#888a77' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#777a6b')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#888a77')}
              onClick={handleAddToCart}
            >
              {added ? (
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Added!
                </div>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>
        </div>
      </Link>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-base sm:text-xl line-clamp-2" style={{ color: '#888a77' }}>
              {product.name}
            </h3>
            <p className="text-sm sm:text-base text-left text-gray-500">{product.subname}</p>
          </div>
          <div className="text-right">
            <span className="text-base sm:text-xl font-bold" style={{ color: '#888a77' }}>₹{product.price}</span>
            <p className="text-sm sm:text-base text-gray-500 line-through">₹{product.originalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
