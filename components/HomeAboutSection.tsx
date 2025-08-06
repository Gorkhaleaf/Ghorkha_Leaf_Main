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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">🌿 Our Heritage</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
              Rooted in the Misty Hills of Darjeeling
            </h2>
            <div className="prose prose-lg text-green-700 space-y-4">
              <p>
                Gorkha Leaf brings you handpicked tea crafted with heritage, pride, and purity. A tribute to our
                Gorkha roots and love for every sip.
              </p>
              <p>
                From the legendary tea gardens of Darjeeling, where every leaf tells a story of tradition,
                craftsmanship, and the indomitable Gorkha spirit.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">5+</div>
                <div className="text-sm text-green-600">Years of Heritage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">40+</div>
                <div className="text-sm text-green-600">Tea Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">10K+</div>
                <div className="text-sm text-green-600">Happy Customers</div>
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
                className="bg-white text-green-600 hover:bg-gray-100 rounded-full w-20 h-20"
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
