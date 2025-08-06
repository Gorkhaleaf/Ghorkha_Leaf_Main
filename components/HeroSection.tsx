import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full">
      <Image
          src="/image1.png"
          alt="Fresh Tea Production"
          fill
          className="z-0 object-cover"
      />
      
      <div className="relative z-20 flex items-center h-full">
          <div className="container mx-auto px-4">
              <div className="max-w-lg">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight font-philosopher text-brand-green">Fresh from our tea gardens to your cup</h1>
                  <p className="text-xl sm:text-2xl md:text-3xl mb-8 text-brand-green">UPTO 32% OFF ON FIRST ORDER</p>
                  <Button
                      size="lg"
                      className="bg-brand-green hover:bg-brand-green/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                  >
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </div>
          </div>
      </div>
    </section>
  )
}

export default HeroSection
