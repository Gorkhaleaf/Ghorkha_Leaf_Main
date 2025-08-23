import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Gloock, Fira_Sans_Condensed, Philosopher } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { LazyPromoModalProvider, initializeModalPerformance } from "@/components/promo-modal/LazyPromoModal"
import { LenisProvider } from "@/components/LenisProvider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  initializeModalPerformance()
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const gloock = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-gloock" })
const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-fira-sans-condensed",
})
const philosopher = Philosopher({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-philosopher",
})

export const metadata: Metadata = {
  title: "Gorkha Leaf - Premium Darjeeling Tea | Authentic Tea Estate Since 1870s",
  description:
    "Experience authentic Darjeeling tea crafted with the Gorkha spirit. Premium first flush, second flush, green tea, and specialty blends direct from our tea gardens. Free shipping on orders above ₹999.",
  keywords:
    "Darjeeling tea, premium tea, first flush, second flush, green tea, white tea, tea estate, organic tea, fair trade tea, Gorkha Leaf, authentic tea, tea online, buy tea",
  authors: [{ name: "Gorkha Leaf Tea Estate" }],
  openGraph: {
    title: "Gorkha Leaf - Premium Darjeeling Tea Estate",
    description:
      "Authentic Darjeeling tea crafted with heritage, pride, and the Gorkha spirit. Shop premium teas direct from our gardens.",
    type: "website",
    locale: "en_US",
    siteName: "Gorkha Leaf",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Gorkha Leaf - Where Every Leaf Tells a Tale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gorkha Leaf - Premium Darjeeling Tea Estate",
    description: "Authentic Darjeeling tea crafted with heritage, pride, and the Gorkha spirit.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${gloock.variable} ${firaSansCondensed.variable} ${philosopher.variable}`}
    >
      <body className={inter.className}>
        <LenisProvider>
          <CartProvider>
            <LazyPromoModalProvider
              heroImageSrc="/teacup.jpg"
              logoSrc="/logo.png"
              couponCode="IDAY30"
              campaignId="iday25"
              variant="A"
              autoTriggerDelay={2000}
            >
              {children}
              <Toaster />
            </LazyPromoModalProvider>
          </CartProvider>
        </LenisProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
