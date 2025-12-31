import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { LazyPromoModalProvider, initializeModalPerformance } from "@/components/promo-modal/LazyPromoModal"
import { LenisProvider } from "@/components/LenisProvider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  initializeModalPerformance()
}

// Optimized font loading - only load essential fonts initially
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Prevent layout shift
  preload: false // Disable preload to prevent unused resource warning
})

// Load decorative fonts with fallback
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
  preload: false
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
  other: {
    "robots": "index, follow",
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
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-839SCRG86M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-839SCRG86M');
          `}
        </Script>

        {/* Rest of your providers/components */}
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
        <Script src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="beforeInteractive" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
