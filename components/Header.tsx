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
import { AnnouncementBar } from "@/components/AnnouncementBar"
import AuthModal from "./AuthModal/AuthModal"
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { cartCount } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <AnnouncementBar />
      <header className="bg-white text-black shadow-sm">
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
              <Link href="/" className="hover:bg-black hover:text-white px-3 py-2 rounded-md nav-link-moderate">
                Home
              </Link>
              <Link href="/products" className="hover:bg-black hover:text-white px-3 py-2 rounded-md nav-link-moderate">
                Products
              </Link>
              <Link href="/our-story" className="hover:bg-black hover:text-white px-3 py-2 rounded-md nav-link-moderate">
                Our Story
              </Link>
              <Link href="/blog" className="hover:bg-black hover:text-white px-3 py-2 rounded-md nav-link-moderate">
                Blog
              </Link>
              <Link href="/contact-us" className="hover:bg-black hover:text-white px-3 py-2 rounded-md nav-link-moderate">
                Contact Us
              </Link>
            </nav>
          </div>
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                    <span className="nav-action-moderate">My Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300"
                onClick={handleModalToggle}
              >
                <User className="h-5 w-5" />
                <span className="nav-action-moderate">Login</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300"
            >
              <Heart className="h-5 w-5" />
              <span className="nav-action-moderate">Wishlist</span>
            </Button>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 relative hover:bg-black hover:text-white transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="nav-action-moderate">Cart</span>
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
      {isModalOpen && <AuthModal onClose={handleModalToggle} />}
    </div>
  )
}
