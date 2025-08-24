"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import BulkSection from '@/components/BulkSection'
import { ScrollProgress } from '@/components/ScrollProgress'
import { FloatingNav } from '@/components/FloatingNav'
import { ChevronUp } from 'lucide-react'

export default function BulkSectionPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

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
      <FloatingNav />

      {/* Breadcrumb Navigation */}
      <nav className="pt-32 pb-4 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-green-700 font-medium">Social Impact & Community Gifting</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <BulkSection />
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 transition-colors z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <Footer />
    </div>
  )
}