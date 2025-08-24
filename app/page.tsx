"use client"

import { lazy, Suspense } from "react"
import { Header } from "@/components/Header"
import HeroSection from "@/components/HeroSection"

// Critical components - load immediately
import { BuyerAnnouncementBar } from "@/components/BuyerAnnouncementBar"
import Footer from "@/components/Footer"

// Lazy load non-critical components with loading fallbacks
const AboutUsSection = lazy(() => import("@/components/AboutUsSection"))
const CategoriesSection = lazy(() => import("@/components/CategoriesSection"))
const FeaturedProductsSection = lazy(() => import("@/components/FeaturedProductsSection"))
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"))
const PerfectionSection = lazy(() => import("@/components/PerfectionSection"))
const HomeAboutSection = lazy(() => import("@/components/HomeAboutSection"))
const BlogSection = lazy(() => import("@/components/BlogSection"))
const OurStoryCompact = lazy(() => import("@/components/OurStoryCompact"))
const GorkhaLeafCares = lazy(() => import("@/components/GorkhaLeafCares"))

// Loading fallback component
const SectionSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div
    className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
    style={{ height }}
  />
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Above the fold content - load immediately */}
      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <AboutUsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <CategoriesSection />
      </Suspense>

      {/* Below the fold content - lazy load with intersection observer */}
      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <FeaturedProductsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="600px" />}>
        <ReviewsSection />
      </Suspense>

      <BuyerAnnouncementBar />

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <PerfectionSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <HomeAboutSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <OurStoryCompact imageSrc="/Extra_content/owner1.jpg" ownerName="Founder, Gorkha Leaf" />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <GorkhaLeafCares imageSrc="/Extra_content/unnamed (10).jpg" imageAlt="A Gorkha woman plucking tender tea leaves in Darjeeling" />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <BlogSection />
      </Suspense>

      <Footer />
    </div>
  )
}
