"use client"

import { Header } from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import AboutUsSection from "@/components/AboutUsSection"
import CategoriesSection from "@/components/CategoriesSection"
import FeaturedProductsSection from "@/components/FeaturedProductsSection"
import LabelSection from "@/components/LabelSection"
import HomeAboutSection from "@/components/HomeAboutSection"
import NewsletterSection from "@/components/NewsletterSection"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutUsSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <section className="py-12">
        <div className="container mx-auto px-4">
           <LabelSection />
        </div>
      </section>
      <HomeAboutSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
