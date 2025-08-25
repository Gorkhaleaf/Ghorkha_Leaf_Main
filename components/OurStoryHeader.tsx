"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { AnnouncementBar } from "@/components/AnnouncementBar"

export function OurStoryHeader() {
  const { cartCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <AnnouncementBar />
      <header className="bg-white/95 backdrop-blur-md text-black shadow-sm border-b border-gray-100">
        <div className="container mx-auto">
          {/* Main Header */}
          <div className="flex items-center justify-between h-20 px-4">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Gorkha Leaf - Where Every Leaf Tells a Tale"
                    width={200}
                    height={60}
                    className="h-12 w-auto"
                    priority
                  />
                </Link>
              </div>
              {/* Navigation Links - Desktop */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/" 
                  className="hover:bg-brand-green hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className="hover:bg-brand-green hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Products
                </Link>
                <Link 
                  href="/our-story" 
                  className="bg-brand-green text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Our Story
                </Link>
                <Link 
                  href="/contact-us" 
                  className="hover:bg-brand-green hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Contact Us
                </Link>
              </nav>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-brand-green hover:text-white transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-brand-green hover:text-white transition-all duration-300"
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Button>
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 relative hover:bg-brand-green hover:text-white transition-all duration-300"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-9 w-9" /> : <Menu className="h-9 w-9" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-2 px-4">
                <Link 
                  href="/" 
                  className="hover:bg-brand-green hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className="hover:bg-brand-green hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  href="/our-story" 
                  className="bg-brand-green text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Story
                </Link>
                <Link 
                  href="/contact-us" 
                  className="hover:bg-brand-green hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-brand-green hover:text-white transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-brand-green hover:text-white transition-all duration-300"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Button>
                  <Link href="/cart">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 relative hover:bg-brand-green hover:text-white transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart</span>
                      {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}