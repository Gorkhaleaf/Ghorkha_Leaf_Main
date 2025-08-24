"use client"

import { Header } from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import AboutUsSection from "@/components/AboutUsSection"
import CategoriesSection from "@/components/CategoriesSection"
import FeaturedProductsSection from "@/components/FeaturedProductsSection"
import ReviewsSection from "@/components/ReviewsSection"
import PerfectionSection from "@/components/PerfectionSection"
import { BuyerAnnouncementBar } from "@/components/BuyerAnnouncementBar"
import HomeAboutSection from "@/components/HomeAboutSection"
import BlogSection from "@/components/BlogSection"
import OurStoryCompact from "@/components/OurStoryCompact";
import GorkhaLeafCares from "@/components/GorkhaLeafCares";
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutUsSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ReviewsSection />
      <PerfectionSection />
      <BuyerAnnouncementBar />
      <HomeAboutSection />
<OurStoryCompact imageSrc="/Extra_content/owner1.jpg" ownerName="Founder, Gorkha Leaf" />
<GorkhaLeafCares imageSrc="/Extra_content/unnamed (10).jpg" imageAlt="A Gorkha woman plucking tender tea leaves in Darjeeling" />
      <BlogSection />
      <Footer />
    </div>
  )
}
