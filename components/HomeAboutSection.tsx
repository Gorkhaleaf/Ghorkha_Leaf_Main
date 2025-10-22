"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Image from "next/image"

const HomeAboutSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div className="lg:pl-20 xl:pl-32">
            <Badge className="mb-3 bg-brand-green/10 text-brand-green border-brand-green/20 text-xs">🌿 Our Heritage</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-3" style={{ lineHeight: '1.2' }}>
              Rooted in the Misty Hills of Darjeeling
            </h2>
            <div className="text-brand-green space-y-2">
              <p className="text-sm md:text-base leading-relaxed">
                Gorkha Leaf brings you handpicked tea crafted with heritage, pride, and purity. A tribute to our
                Gorkha roots and love for every sip.
              </p>
              <p className="text-sm md:text-base leading-relaxed">
                From the legendary tea gardens of Darjeeling, where every leaf tells a story of tradition,
                craftsmanship, and the indomitable Gorkha spirit.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-green">1+</div>
                <div className="text-xs md:text-sm text-brand-green">Years of Journey</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-green">6+</div>
                <div className="text-xs md:text-sm text-brand-green">Signature Teas</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-green">100+</div>
                <div className="text-xs md:text-sm text-brand-green">Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg shadow-2xl overflow-hidden">
            <video
              ref={videoRef}
              src="/darjelling.mp4"
              loop
              muted
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div
              className={`absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                isPlaying ? "opacity-0" : "opacity-100"
              }`}
            >
              <Button
                size="icon"
                className="bg-white text-brand-green hover:bg-gray-100 rounded-full w-20 h-20"
                onClick={togglePlay}
              >
                <Play className="h-10 w-10" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeAboutSection
