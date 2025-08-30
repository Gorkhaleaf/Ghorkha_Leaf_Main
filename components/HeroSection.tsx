'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from "@/hooks/use-mobile"

const HeroSection = () => {
   const [mounted, setMounted] = useState(false);
   const [windowHeight, setWindowHeight] = useState(0);
   const isMobile = useIsMobile();
   const heroRef = useRef<HTMLElement>(null);

   useEffect(() => {
     setMounted(true);

     // Use a more stable height calculation for mobile
     const updateHeight = () => {
       if (typeof window !== 'undefined') {
         // Use 100vh for desktop, but cap at screen height for mobile to avoid issues
         const vh = window.innerHeight * 0.01;
         document.documentElement.style.setProperty('--vh', `${vh}px`);

         if (isMobile) {
           // For mobile, use a more stable approach
           setWindowHeight(Math.min(window.innerHeight, window.screen.height));
         } else {
           setWindowHeight(window.innerHeight);
         }
       }
     };

     updateHeight();

     const handleResize = () => {
       updateHeight();
     };

     const handleOrientationChange = () => {
       // Delay to allow for orientation change to complete
       setTimeout(updateHeight, 100);
     };

     window.addEventListener('resize', handleResize);
     window.addEventListener('orientationchange', handleOrientationChange);

     return () => {
       window.removeEventListener('resize', handleResize);
       window.removeEventListener('orientationchange', handleOrientationChange);
     };
   }, [isMobile]);



  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden m-0 p-0"
      style={{
        height: windowHeight ? `${windowHeight}px` : '100vh',
        minHeight: isMobile ? '100svh' : '100vh' // Use small viewport height on mobile
      }}
    >
      {/* Full screen video background */}
      {mounted && (
        <div className="absolute inset-0 w-full h-full z-10">
          <video
            src="/trainvid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content overlay - desktop: bottom-left, mobile: centered */}
      <div className={`relative z-20 flex items-end h-full px-4 pb-6 sm:pb-8 md:pb-12
        ${isMobile ? 'justify-center' : 'justify-start'}`}>
        <div className={`w-full max-w-4xl ${isMobile ? '' : 'ml-4 lg:ml-8 xl:ml-12'}`}>
          <div className={`${isMobile ? 'max-w-sm mx-auto text-center' : 'max-w-2xl lg:max-w-3xl text-left'}`}>
            {/* Main heading - responsive sizing */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-[0.02em] font-philosopher text-white drop-shadow-2xl mb-4 lg:mb-6">
              <div className="block">Fresh from our</div>
              <div className="block">tea gardens to</div>
              <div className="block">your cup</div>
            </h1>

            {/* Offer text - responsive sizing */}
            <p className="text-xl sm:text-2xl md:text-3xl mb-6 lg:mb-8 text-white tracking-[0.12em] drop-shadow-xl">
              UPTO 32% OFF ON FIRST ORDER
            </p>

            {/* Shop Now button - desktop: normal, mobile: full width */}
            <Button
              asChild
              size="lg"
              className={`bg-brand-green hover:bg-brand-green/90 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-2xl transition-all duration-300 hover:scale-105
                ${isMobile ? 'w-full max-w-xs mx-auto' : ''}`}
            >
              <Link href="/products" className={`inline-flex items-center ${isMobile ? 'justify-center w-full' : ''}`}>
                <span>Shop Now</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
