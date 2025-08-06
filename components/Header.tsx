"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export function Header() {
  const { cartCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)

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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-[#fbf6f0] text-black" : "bg-transparent text-black"
      }`}
    >
      <div className="container mx-auto">
        {/* Main Header */}
        <div className={`flex items-center justify-between h-20 px-4`}>
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
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/products" className="hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Products
              </Link>
              <Link href="/our-story" className="hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Our Story
              </Link>
              <Link href="/contact-us" className="hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Contact Us
              </Link>
            </nav>
          </div>
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300 ${
                !isScrolled ? "bg-white/20 backdrop-blur-sm" : ""
              }`}
            >
              <User className="h-5 w-5" />
              <span>Login</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300 ${
                !isScrolled ? "bg-white/20 backdrop-blur-sm" : ""
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </Button>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 relative hover:bg-black hover:text-white transition-all duration-300 ${
                  !isScrolled ? "bg-white/20 backdrop-blur-sm" : ""
                }`}
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
        </div>
      </div>
    </header>
  )
}
