'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from 'react';

// SplineScene component
const SplineScene = ({ scene, onLoad, onError }: { 
  scene: string; 
  onLoad?: (splineApp: any) => void;
  onError?: (error: any) => void;
}) => {
  const [Spline, setSpline] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        const splineModule = await import('@splinetool/react-spline');
        setSpline(() => splineModule.default);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load Spline:', err);
        setError(true);
        setLoading(false);
        onError?.(err);
      }
    };

    loadSpline();
  }, [onError]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-white/30"></div>
          <p className="text-white text-sm md:text-base font-semibold">Loading 3D Experience...</p>
        </div>
      </div>
    );
  }

  if (error || !Spline) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white text-sm md:text-base font-medium">3D Model Unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <Spline 
      scene={scene}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSplineLoad = (splineApp: any) => {
    console.log('Spline loaded:', splineApp);
    
    // Remove background
    if (splineApp?.scene) {
      splineApp.scene.background = null;
    }
    if (splineApp?.renderer) {
      splineApp.renderer.setClearColor(0x000000, 0);
    }

    // Try to slow down animations
    if (splineApp?.scene) {
      splineApp.scene.traverse((child: any) => {
        if (child.mixer) {
          child.mixer.timeScale = 0.1;
        }
      });

      if (splineApp.mixers && splineApp.mixers.length > 0) {
        splineApp.mixers.forEach((mixer: any) => {
          mixer.timeScale = 0.3;
        });
      }
    }
  };

  const handleSplineError = (error: any) => {
    console.error('Spline loading error:', error);
  };

  return (
    <section 
      className="relative w-full overflow-hidden m-0 p-0"
      style={{ 
        height: windowHeight ? `${windowHeight}px` : '100vh',
        minHeight: '100vh'
      }}
    >
      {/* 3D Spline Model - Full background */}
      {mounted && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none spline-transparent-bg">
          <SplineScene
            scene="https://prod.spline.design/bI31fOpEAAWihn4s/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
          />
        </div>
      )}
      
      {/* Content overlay - positioned in lower left with proper sizing */}
      <div className="relative z-20 flex items-end justify-start h-full px-4 pb-8 lg:pb-12">
        <div className="ml-4 lg:ml-8 xl:ml-12 mb-8 lg:mb-12">
          <div className="max-w-2xl lg:max-w-3xl text-left">
            {/* Main heading in 3 lines - properly sized */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-[0.02em] font-philosopher text-white drop-shadow-2xl mb-4 lg:mb-6">
              <div className="block">Fresh from our</div>
              <div className="block">tea gardens to</div>
              <div className="block">your cup</div>
            </h1>
            
            {/* Offer text */}
            <p className="text-xl sm:text-2xl md:text-3xl mb-6 lg:mb-8 text-white tracking-[0.12em] drop-shadow-xl">
              UPTO 32% OFF ON FIRST ORDER
            </p>
            
            {/* Shop Now button */}
            <Button
              asChild
              size="lg"
              className="bg-brand-green hover:bg-brand-green/90 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/products" className="inline-flex items-center">
                Shop Now
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
