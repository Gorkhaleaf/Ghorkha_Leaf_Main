import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Image
              src="/logo.png"
              alt="Gorkha Leaf"
              width={180}
              height={54}
              className="h-10 w-auto brightness-0 invert mb-6"
            />
            <p className="text-green-200 mb-6 max-w-md">
              Authentic Darjeeling tea crafted with the strength, dignity, and resilience of the Gorkha spirit. Where
              every leaf tells a tale.
            </p>
            <div className="space-y-2 text-sm text-green-200">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Darjeeling, West Bengal, India</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91-7204390477</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@gorkhaleaf.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  First Flush
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Second Flush
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Green Tea
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  White Tea
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Gift Sets
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tea Gardens
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Quality
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund-policy" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pricing-policy" className="hover:text-white transition-colors">
                  Pricing Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-green-200 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Gorkha Leaf. All rights reserved. Made with ❤️ in Darjeeling.
            </p>
            <div className="flex items-center space-x-6 text-sm text-green-200">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cancellation-refund-policy" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
