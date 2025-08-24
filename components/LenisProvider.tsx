"use client"

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Performance check - disable on low-performance devices
    const isLowPerformance = () => {
      if (typeof window === 'undefined') return false
      return window.navigator.hardwareConcurrency <= 2 ||
             window.devicePixelRatio < 1 ||
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }

    if (isLowPerformance()) {
      setIsInitialized(true)
      return
    }

    // Initialize Lenis with optimized options for smooth scrolling
    const lenis = new Lenis({
      duration: 1.0, // Reduced from 1.2 for better performance
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.8, // Reduced for smoother performance
      touchMultiplier: 1.5,
      infinite: false,
    })

    lenisRef.current = lenis

    let animationId: number

    function raf(time: number) {
      lenis.raf(time)
      animationId = requestAnimationFrame(raf)
    }

    animationId = requestAnimationFrame(raf)

    // Add lenis classes to html for CSS targeting
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    // Enable smooth scrolling on the body
    document.body.style.scrollBehavior = 'auto'

    // Handle resize events with throttling
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        lenis.resize()
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    setIsInitialized(true)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      lenis.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      document.body.style.scrollBehavior = ''
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // Don't render children until Lenis is ready or disabled
  if (!isInitialized) {
    return (
      <div className="min-h-screen">
        {/* Loading state */}
        {children}
      </div>
    )
  }

  return <>{children}</>
}