"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Verified } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReviewsBackground from "@/components/ReviewsBackground"

interface Review {
  id: number
  rating: number
  title: string
  review: string
  customerName: string
  location: string
  customerImage: string
  productImage: string
  verified: boolean
  productPurchased: string
  purchaseDate: string
}

const reviewsData: Review[] = [
  {
    id: 1,
    rating: 5,
    title: "AUTHENTIC HIMALAYAN EXPERIENCE",
    review: "The aroma alone transported me to the misty mountains of Nepal. Every sip tells a story of tradition and craftsmanship that's been perfected over generations.",
    customerName: "Ananya Patel",
    location: "Mumbai, India",
    customerImage: "/testimonials/ananya-patel.jpg",
    productImage: "/darjeeling-500x500.jpg",
    verified: true,
    productPurchased: "Premium Himalayan Gold",
    purchaseDate: "2024-11-15"
  },
  {
    id: 2,
    rating: 5,
    title: "UNMATCHED QUALITY & FRESHNESS",
    review: "I've tried teas from around the world, but Gorkha Leaf's quality is exceptional. The leaves arrive so fresh, you can smell the mountain air in every package.",
    customerName: "Mike Taylor",
    location: "London, UK",
    customerImage: "/testimonials/mike-taylor.png",
    productImage: "/green-tea.png",
    verified: true,
    productPurchased: "Everest Morning Blend",
    purchaseDate: "2024-12-01"
  },
  {
    id: 3,
    rating: 5,
    title: "MY DAILY RITUAL TRANSFORMED",
    review: "What started as curiosity became my morning meditation. The rich, complex flavors wake up all my senses. This isn't just tea—it's liquid poetry.",
    customerName: "Priya Sharma",
    location: "Delhi, India",
    customerImage: "/testimonials/priya-sharma.jpg",
    productImage: "/black-tea.png",
    verified: true,
    productPurchased: "Royal Gurkha Reserve",
    purchaseDate: "2024-10-20"
  },
  {
    id: 4,
    rating: 5,
    title: "SUSTAINABLE AND SOUL-WARMING",
    review: "Knowing that each purchase supports local farmers makes every cup taste even better. The packaging is beautiful and eco-friendly too!",
    customerName: "Rahul Mehta",
    location: "Bangalore, India",
    customerImage: "/testimonials/rahul-mehta.jpg",
    productImage: "/herbal-tea.png",
    verified: true,
    productPurchased: "Organic Mountain Mist",
    purchaseDate: "2024-11-28"
  },
  {
    id: 5,
    rating: 5,
    title: "PERFECT GIFT FOR TEA ENTHUSIASTS",
    review: "Bought this as a gift for my tea-loving mother. She calls it 'liquid gold from the roof of the world.' Now I'm ordering for myself too!",
    customerName: "Rohan Sharma",
    location: "Pune, India",
    customerImage: "/testimonials/rohan-sharma.jpg",
    productImage: "/oolong.png",
    verified: true,
    productPurchased: "Heritage Gift Collection",
    purchaseDate: "2024-12-10"
  },
  {
    id: 6,
    rating: 5,
    title: "STRENGTH MEETS ELEGANCE",
    review: "Bold yet refined, just like the legendary Gorkha warriors. This tea gives me the energy to conquer my day while keeping me centered and calm.",
    customerName: "Vikram Singh",
    location: "Jaipur, India",
    customerImage: "/testimonials/vikram-singh.jpg",
    productImage: "/chai.png",
    verified: true,
    productPurchased: "Warrior's Strength Chai",
    purchaseDate: "2024-11-05"
  }
]

const ReviewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)
  const totalSlides = reviewsData.length

  // Responsive slides configuration
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1)
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(totalSlides / slidesToShow))
    }, 5000)

    return () => clearInterval(interval)
  }, [totalSlides, slidesToShow])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(totalSlides / slidesToShow))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(totalSlides / slidesToShow) - 1 : prev - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <section className="reviews-section-bg relative py-20 overflow-hidden">
        <ReviewsBackground className="absolute inset-0 z-0 pointer-events-none" />
      

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wider">
            STORIES FROM OUR TEA FAMILY
          </h2>
          <p className="text-xl text-white/90 mb-6 font-light tracking-wide">
            Real experiences from our cherished customers worldwide
          </p>
          <div className="flex items-center justify-center gap-4 text-2xl text-yellow-400 font-semibold">
            <Star className="w-8 h-8 fill-current animate-pulse" />
            <span>15,000+ Reviews (4.8/5 Stars)</span>
            <Star className="w-8 h-8 fill-current animate-pulse" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-8"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`
              }}
            >
              {reviewsData.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 relative overflow-hidden group">
                    {/* Top Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{background: 'linear-gradient(90deg, #166434, #22c55e)'}}></div>

                    {/* Customer Profile */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-100">
                      <div className="relative">
                        <img
                          src={review.customerImage}
                          alt={review.customerName}
                          className="w-16 h-16 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                        />
                        {review.verified && (
                          <div className="absolute -bottom-1 -right-1 rounded-full p-1" style={{backgroundColor: '#166434'}}>
                            <Verified className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">{review.customerName}</h4>
                        <p className="text-gray-600 text-sm">{review.location}</p>
                      </div>
                      {review.verified && (
                        <span className="text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg" style={{background: 'linear-gradient(45deg, #166434, #22c55e)'}}>
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Review Title */}
                    <h3 className="text-center font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                      {review.title}
                    </h3>

                    {/* Review Text */}
                    <div className="relative mb-6">
                      <div className="absolute -top-2 -left-2 text-6xl font-bold leading-none" style={{color: '#16643450'}}>"</div>
                      <p className="text-gray-700 leading-relaxed italic pl-6 pr-2 text-base">
                        {review.review}
                      </p>
                    </div>

                    {/* Product Showcase */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                      <img
                        src={review.productImage}
                        alt={review.productPurchased}
                        className="w-14 h-14 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{review.productPurchased}</p>
                        <p className="text-gray-600 text-xs">Purchased: {formatDate(review.purchaseDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Button>

          <Button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-110"
            disabled={currentSlide === Math.ceil(totalSlides / slidesToShow) - 1}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {[...Array(Math.ceil(totalSlides / slidesToShow))].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg"></div>
    </section>
  )
}

export default ReviewsSection