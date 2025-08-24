"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Leaf,
  Heart,
  Globe,
  Shield,
  ArrowRight,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronUp,
  Users,
  Award,
  Target,
  Eye
} from 'lucide-react'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import './our-story.css'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "", className }: { end: number, duration?: number, suffix?: string, className?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startCount = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * (end - startCount) + startCount))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className={`text-4xl md:text-6xl font-bold ${className || 'text-brand-green'}`}>
      {count.toLocaleString()}{suffix}
    </div>
  )
}

// Video Player Component
function VideoPlayer({ src, poster }: { src: string, poster?: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted={isMuted}
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex space-x-4">
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OurStory() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  const brandValues = [
    { 
      icon: Leaf, 
      title: "Authenticity", 
      description: "We stay true to our roots — every leaf reflects Darjeeling's spirit." 
    },
    { 
      icon: Heart, 
      title: "Respect", 
      description: "For our tea workers, land, customers, and traditions." 
    },
    { 
      icon: Users, 
      title: "Community First", 
      description: "We believe in growing together — our success is shared." 
    },
    { 
      icon: Shield, 
      title: "Pride in Culture", 
      description: "We carry the Gorkha identity with strength and humility." 
    },
    { 
      icon: Globe, 
      title: "Transparency", 
      description: "We tell real stories, source ethically, and share openly." 
    },
    { 
      icon: Award, 
      title: "Mindful Craftsmanship", 
      description: "Each pouch is packed with care, passion, and purpose." 
    }
  ]

  const gorkhaValues = [
    { icon: "🌿", title: "Heritage", description: "Rooted in centuries of tea tradition" },
    { icon: "🛡️", title: "Honor", description: "Upholding the warrior spirit" },
    { icon: "💚", title: "Hard Work", description: "Dedication in every leaf" },
    { icon: "⚔️", title: "Courage", description: "Fearless in our mission" }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      <ScrollProgress />
      <Header />
      
      {/* Breadcrumb Navigation */}
      <nav className="pt-32 pb-4 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-green font-medium">Our Story</span>
          </div>
        </div>
      </nav>

      {/* Hero Video Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <VideoPlayer 
            src="/Extra_content/Tea Estate.mp4" 
            poster="/Extra_content/unnamed (1).jpg"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
        
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-300">
            Connecting People, One Cup at a Time
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
            Love for tea is universal across borders and oceans. It transcends culture, connecting traditions throughout the world.
          </p>
          <Button 
            size="lg" 
            className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-4 text-lg animate-fade-in-up animation-delay-900"
          >
            Discover Our Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <ChevronUp className="w-6 h-6 text-white rotate-180" />
          </div>
        </div>
      </section>

      {/* My Story Section - Detailed Personal Story */}
      <section id="my-story" className="py-20 bg-gradient-to-br from-brand-beige to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-green mb-6">
                🌿 My Story – The Heart Behind Gorkha Leaf
              </h2>
              <div className="w-24 h-1 bg-brand-green mx-auto mb-8"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    I was born to a family deeply rooted in the hills of Darjeeling. My mother worked tirelessly in the tea gardens, hand-plucking leaves under the sun with grace, strength, and dignity. Her labor, like that of many others in the estates, and yet, the world that sips Darjeeling tea often forgets the hands that plucked it.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    My father began his journey in the same tea estate, but life took a turn — he was fortunate to move into the Indian Army. I often think about how different our life could have been had he stayed behind. His path gave our family a level of stability, but it never distanced us from the struggles of our community back home.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-lg leading-relaxed text-gray-700">
                    Growing up, I witnessed both — the hardship of those in the tea estates and the discipline and sacrifice that come with serving the nation. That contrast shaped me.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src="/Extra_content/owner1.jpg"
                    alt="Founder's story - Tea plantation heritage"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-green rounded-full flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Business Vision */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="aspect-square rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src="/Extra_content/unnamed (2).jpg"
                    alt="Tea business vision"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-green rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    When I decided to start my own business, I looked no further than the land I came from — rich, aromatic, and known worldwide. But this wasn't just about selling tea. This was about telling the story of every leaf, every laborer, and every hill that gave it life.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    <strong className="text-brand-green">Gorkha Leaf is my tribute</strong> — to my parents, to every tea worker, and to the Gorkha spirit of resilience and pride.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-brand-green to-brand-green/80 p-8 rounded-2xl shadow-lg text-white">
                  <p className="text-lg leading-relaxed mb-6">
                    While I may not be able to change everything overnight, my dream is bigger than a brand. I want to give back: to support education for children in tea estates, bring smiles through festive gifts, and host community lunches that bring people together — starting in Darjeeling and spreading across every tea-growing region.
                  </p>
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2">This isn't just tea. This is a promise.</p>
                    <p className="text-lg">It's my story.</p>
                    <p className="text-lg">It's our story.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-vision" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-green mb-6">
                Our Mission & Vision
              </h2>
              <div className="w-24 h-1 bg-brand-green mx-auto mb-8"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="group bg-gradient-to-br from-brand-beige to-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-brand-green/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-green mb-6">Mission</h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 text-center">
                  To bring the authentic essence of Darjeeling's tea culture to the world — one leaf, one story, and one soul at a time — while supporting the people and heritage that make it special.
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-brand-beige to-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-brand-green/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-green mb-6">Vision</h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 text-center">
                  To become a globally loved tea brand that celebrates the Gorkha spirit, uplifts local communities, and preserves the legacy of Himalayan tea craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-green mb-6">
              Core Values
            </h2>
            <div className="w-24 h-1 bg-brand-green mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {brandValues.map((value, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-brand-green/20"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-green mb-4 group-hover:text-brand-green/80 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Gorkha Leaf Section */}
      <section id="gorkha-leaf-name" className="py-20 bg-gradient-to-br from-brand-beige to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-green mb-6">
                📜 Why I Chose the Name "Gorkha Leaf"
              </h2>
              <div className="w-24 h-1 bg-brand-green mx-auto mb-8"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    The name Gorkha Leaf is not just a brand — it's a tribute to who we are, where we come from, and what we stand for.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    <strong className="text-brand-green">"Gorkha"</strong> represents the proud and resilient people of the hills — known not only for their contribution to tea cultivation but also for their legendary strength, discipline, and bravery.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    Historically, the Gorkhas are known as fearless warriors, respected across the world for their service in the Indian Army and British Army. My own father served in the army, which makes this connection even more personal.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    <strong className="text-brand-green">"Leaf"</strong> represents our product — the sacred Darjeeling tea leaf — but it also symbolizes every story and sacrifice woven into that cup of tea.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src="/Extra_content/owner2.png"
                    alt="Gorkha heritage and tea tradition"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-green rounded-full flex items-center justify-center">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Gorkha Leaf Values */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-brand-green mb-8">
                Together, Gorkha Leaf stands for:
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {gorkhaValues.map((value, index) => (
                <div 
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-brand-green mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-brand-green to-brand-green/80 p-8 rounded-2xl shadow-lg text-white max-w-2xl mx-auto">
                <p className="text-xl font-bold">
                  It's a name that holds the past with pride and moves toward the future with purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Counters Section */}
      <section id="impact" className="py-20 bg-gradient-to-r from-brand-green to-brand-green/80 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Impact
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <AnimatedCounter end={125} className="text-white" />
              <p className="text-xl mt-4">Years of Heritage</p>
            </div>
            <div>
              <AnimatedCounter end={50} suffix="+" className="text-white" />
              <p className="text-xl mt-4">Countries Served</p>
            </div>
            <div>
              <AnimatedCounter end={10000} suffix="+" className="text-white" />
              <p className="text-xl mt-4">Happy Customers</p>
            </div>
            <div>
              <AnimatedCounter end={25} className="text-white" />
              <p className="text-xl mt-4">Tea Varieties</p>
            </div>
          </div>
        </div>
      </section>

      <Gallery />


      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-brand-green text-white p-3 rounded-full shadow-lg hover:bg-brand-green/90 transition-colors z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}
