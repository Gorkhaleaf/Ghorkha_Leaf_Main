import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { Filter, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"
import React, { useEffect, useState } from "react"

type Product = any

const FeaturedProductsSection: React.FC = () => {
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
    <section id="featured-products" className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 sm:mb-10">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-green mb-2 sm:mb-4 pl-2 sm:pl-4">Our Products</h2>
            <p className="text-base sm:text-lg text-brand-green pl-2 sm:pl-4">Handpicked selections from our premium collection</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent text-xs">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Mobile: Carousel with 2 cards, Desktop: Multi-card Carousel */}
        <div className="block sm:hidden">
          {/* Mobile Carousel - 2 cards at a time */}
          <div className="relative overflow-hidden">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                skipSnaps: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/2 pl-2">
                    <ProductCard product={product} compact={true} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 top-[35%] bg-white hover:bg-gray-50 border-2 border-brand-green/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-8 h-8 z-10" />
              <CarouselNext className="right-2 top-[35%] bg-white hover:bg-gray-50 border-2 border-brand-green/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-8 h-8 z-10" />
            </Carousel>
          </div>
        </div>

        <div className="hidden sm:block relative overflow-hidden py-6 sm:py-8 px-0 sm:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
            }}
            className="w-full featured-products-carousel"
          >
            <CarouselContent className="ml-0 sm:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-[95%] xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-0 pr-3 sm:pl-4 sm:pr-0">
                  <ProductCard product={product} compact={true} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12 bg-white hover:bg-gray-50 border-2 border-brand-green/20 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 w-12 h-12 z-10" />
            <CarouselNext className="hidden sm:flex -right-12 bg-white hover:bg-gray-50 border-2 border-brand-green/20 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 w-12 h-12 z-10" />
          </Carousel>
        </div>

        <div className="text-center mt-4 sm:mt-6">
          <Link href="/products">
            <Button
              className="text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-brand-green hover:bg-brand-green/90 text-white"
            >
              <span className="hidden sm:inline">View All Products</span>
              <span className="sm:hidden">View All</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSection
