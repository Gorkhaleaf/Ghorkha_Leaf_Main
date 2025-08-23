"use client"

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with optimized options for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Add lenis classes to html for CSS targeting
    document.documentElement.classList.add('lenis', 'lenis-smooth')
    
    // Enable smooth scrolling on the body
    document.body.style.scrollBehavior = 'auto'

    // Handle resize events
    const handleResize = () => {
      lenis.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      document.body.style.scrollBehavior = ''
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <>{children}</>
}