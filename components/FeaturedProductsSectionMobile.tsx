"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart, Zap, Check } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { BuyNowModal } from "./BuyNowModal"

type Product = any

// Mobile-optimized ProductCard component
const MobileProductCard: React.FC<{ product: Product }> = ({ product }) => {
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
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Container - Fixed height for consistency */}
        <div 
          className="relative bg-gray-50 h-40 flex-shrink-0"
          onClick={handleProductClick}
        >
          <Image
            src={getImageSrc()}
            alt={product.name || "Product"}
            fill
            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Organic Badge */}
          {product.isOrganic && (
            <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              Organic
            </div>
          )}
        </div>

        {/* Content Container - Fixed structure for consistency */}
        <div className="flex flex-col flex-1 p-3">
          {/* Product Info */}
          <div className="flex-1 mb-3" onClick={handleProductClick}>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 hover:text-brand-green transition-colors duration-200 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            {(product.subname || product.subtitle) && (
              <p className="text-gray-500 text-xs mb-2 line-clamp-1 min-h-[1rem]">
                {product.subname || product.subtitle}
              </p>
            )}

            {/* Collections/Tags - Limited to maintain consistency */}
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
          <div className="mb-3 min-h-[1.5rem]">
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

          {/* Action Buttons - Consistent layout */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 py-2 px-2 text-xs"
            >
              {added ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3" />
                  <span>Add</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 py-2 px-2 text-xs"
            >
              <Zap className="h-3 w-3" />
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

const FeaturedProductsSectionMobile: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    fetch("/api/admin/products")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        if (mounted) setProducts(data || [])
      })
      .catch((err) => {
        console.error("Failed to load products for featured section", err)
        setProducts([])
      })
    return () => { mounted = false }
  }, [])

  return (
    <section id="featured-products-mobile" className="py-6 bg-white">
      <div className="container mx-auto px-3">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-green mb-2">Our Products</h2>
          <p className="text-sm text-brand-green">Premium tea collection</p>
        </div>

        {/* Products Grid - Mobile optimized */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="w-full">
              <MobileProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/products">
            <Button
              className="text-sm px-6 py-3 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSectionMobile