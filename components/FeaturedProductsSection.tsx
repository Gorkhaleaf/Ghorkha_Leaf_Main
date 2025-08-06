import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { products } from "@/lib/products"
import { Filter, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"

const FeaturedProductsSection = () => {
  return (
    <section id="featured-products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-10">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4" style={{ color: '#888a77' }}>Our Products</h2>
            <p className="text-sm sm:text-base text-green-600" style={{ color: '#888a77' }}>Handpicked selections from our premium collection</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden py-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="text-center mt-6">
          <Link href="/products">
            <Button
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              style={{ backgroundColor: '#888a77', color: 'white' }}
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSection
