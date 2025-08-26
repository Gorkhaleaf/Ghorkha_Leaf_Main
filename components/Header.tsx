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
  Menu,
  X,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

export function Header() {
   const { cartCount } = useCart()
   const isMobile = useIsMobile()
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
          <div className="flex items-center gap-4">
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

            {/* Mobile Hamburger Menu */}
            {isMobile && (
              <>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <Menu className="h-12 w-12" />
                    </Button>
                  </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left uppercase tracking-wide">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile Navigation Links */}
                    <nav className="space-y-4">
                      <Link
                        href="/"
                        className="block px-3 py-2 text-lg hover:bg-black hover:text-white rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/products"
                        className="block px-3 py-2 text-lg hover:bg-black hover:text-white rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Products
                      </Link>
                      <Link
                        href="/our-story"
                        className="block px-3 py-2 text-lg hover:bg-black hover:text-white rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Our Story
                      </Link>
                      <Link
                        href="/blog"
                        className="block px-3 py-2 text-lg hover:bg-black hover:text-white rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Blog
                      </Link>
                      <Link
                        href="/contact-us"
                        className="block px-3 py-2 text-lg hover:bg-black hover:text-white rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Contact Us
                      </Link>
                    </nav>

                    {/* Mobile Header Actions */}
                    <div className="space-y-4 pt-4 border-t">
                      {session ? (
                        <div className="space-y-2">
                          <div className="px-3 py-2 text-lg font-medium">My Account</div>
                          <Link
                            href="/account"
                            className="block px-3 py-2 text-base hover:bg-black hover:text-white rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/account/orders"
                            className="block px-3 py-2 text-base hover:bg-black hover:text-white rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout()
                              setIsMobileMenuOpen(false)
                            }}
                            className="block w-full text-left px-3 py-2 text-base hover:bg-black hover:text-white rounded-md transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-3 py-2 text-lg hover:bg-black hover:text-white transition-all duration-300"
                          onClick={() => {
                            handleModalToggle()
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          <User className="h-5 w-5 mr-2" />
                          Login
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-lg hover:bg-black hover:text-white transition-all duration-300"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Wishlist
                      </Button>

                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Cart Icon */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-black hover:text-white transition-all duration-300 relative ml-2"
                >
                  <ShoppingCart className="h-8 w-8" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              </>
            )}
          </div>

          {/* Desktop Navigation and Actions */}
          {!isMobile && (
            <>
              {/* Navigation Links */}
              <nav className="flex items-center space-x-8">
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
            </>
          )}
        </div>
      </div>
      </header>
      {isModalOpen && <AuthModal onClose={handleModalToggle} />}
    </div>
  )
}
