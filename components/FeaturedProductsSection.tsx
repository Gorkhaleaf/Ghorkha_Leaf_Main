import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { products } from "@/lib/products"
import { Filter, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"

const FeaturedProductsSection = () => {
  return (
    <section id="featured-products" className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 sm:mb-10">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-green mb-2 sm:mb-4 pl-2 sm:pl-4">Our Products</h2>
            <p className="text-base sm:text-lg text-brand-green pl-2 sm:pl-4">Handpicked selections from our premium collection</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent text-sm">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden py-4 sm:py-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 sm:pl-4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>

        <div className="text-center mt-4 sm:mt-6">
          <Link href="/products">
            <Button
              className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-brand-green hover:bg-brand-green/90 text-white"
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
