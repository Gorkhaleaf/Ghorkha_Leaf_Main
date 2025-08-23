"use client"

import React, { lazy, Suspense, useState, useEffect } from 'react'
import { promoStorage } from '@/lib/utils/promoStorage'

// Lazy load the main modal component
const PromoModal = lazy(() => 
  import('./PromoModal').then(module => ({ default: module.PromoModal }))
)

// Lazy load the provider
const PromoModalProvider = lazy(() => 
  import('./PromoModalProvider').then(module => ({ default: module.PromoModalProvider }))
)

interface LazyPromoModalProps {
  children: React.ReactNode
  heroImageSrc?: string
  logoSrc?: string
  couponCode?: string
  campaignId?: string
  variant?: string
  autoTriggerDelay?: number
  disabled?: boolean
}

// Loading fallback component
function ModalLoadingFallback() {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-none">
      <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Error boundary for modal
class PromoModalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Promo Modal Error:', error, errorInfo)
    
    // Track error in analytics if available
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'promo_modal_error',
        error_message: error.message,
        error_stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p className="text-sm">Promo modal failed to load</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Performance monitoring hook
function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      // Track component load time
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'component_performance',
          component_name: componentName,
          load_time_ms: Math.round(loadTime),
          timestamp: new Date().toISOString()
        })
      }
    }
  }, [componentName])
}

// Preload modal assets when user shows intent
function useModalPreloader(shouldPreload: boolean) {
  useEffect(() => {
    if (!shouldPreload) return

    // Preload modal component
    import('./PromoModal')
    import('./PromoModalProvider')
    
    // Preload critical images
    const imageUrls = ['/logo.png', '/placeholder.jpg']
    imageUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      document.head.appendChild(link)
    })
  }, [shouldPreload])
}

// Smart loading strategy
function useSmartLoading(campaignId: string) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [preloadTriggered, setPreloadTriggered] = useState(false)

  useEffect(() => {
    // Check if modal should be shown
    const shouldShow = !promoStorage.isDismissed(campaignId) && !promoStorage.isSubscribed()
    
    if (shouldShow) {
      // Delay loading slightly to not block initial page render
      const timer = setTimeout(() => {
        setShouldLoad(true)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [campaignId])

  useEffect(() => {
    if (shouldLoad && !preloadTriggered) {
      setPreloadTriggered(true)
    }
  }, [shouldLoad, preloadTriggered])

  return { shouldLoad, preloadTriggered }
}

export function LazyPromoModalProvider({
  children,
  heroImageSrc = '/teacup.jpg',
  logoSrc = '/logo.png',
  couponCode = 'IDAY30',
  campaignId = 'iday25',
  variant = 'A',
  autoTriggerDelay = 2000,
  disabled = false
}: LazyPromoModalProps) {
  const { shouldLoad, preloadTriggered } = useSmartLoading(campaignId)
  
  usePerformanceMonitoring('LazyPromoModalProvider')
  useModalPreloader(preloadTriggered)

  // Don't render anything if disabled or shouldn't load
  if (disabled || !shouldLoad) {
    return <>{children}</>
  }

  return (
    <PromoModalErrorBoundary>
      <Suspense fallback={<ModalLoadingFallback />}>
        <PromoModalProvider
          heroImageSrc={heroImageSrc}
          logoSrc={logoSrc}
          couponCode={couponCode}
          campaignId={campaignId}
          variant={variant}
          autoTriggerDelay={autoTriggerDelay}
          disabled={disabled}
        >
          {children}
        </PromoModalProvider>
      </Suspense>
    </PromoModalErrorBoundary>
  )
}

// Hook for checking if modal should be loaded (for SSR optimization)
export function useModalLoadingStrategy(campaignId: string = 'iday25') {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Check conditions
    const isDismissed = promoStorage.isDismissed(campaignId)
    const isSubscribed = promoStorage.isSubscribed()
    
    setShouldLoad(!isDismissed && !isSubscribed)
  }, [campaignId])

  return shouldLoad
}

// Critical CSS injection for above-the-fold content
export function injectCriticalModalCSS() {
  if (typeof document === 'undefined') return

  const criticalCSS = `
    .promo-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.45);
      backdrop-filter: blur(6px);
      z-index: 9990;
      opacity: 0;
      transition: opacity 180ms ease;
    }
    .promo-modal-backdrop--visible {
      opacity: 1;
    }
    .promo-modal-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -46%) scale(0.98);
      width: min(92vw, 920px);
      max-height: min(88vh, 760px);
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
      z-index: 9991;
      opacity: 0;
      transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .promo-modal-container--visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    @media (max-width: 767px) {
      .promo-modal-container {
        grid-template-columns: 1fr;
        width: min(94vw, 560px);
      }
    }
    .modal-open {
      overflow: hidden !important;
    }
  `

  const styleElement = document.createElement('style')
  styleElement.textContent = criticalCSS
  styleElement.setAttribute('data-critical-modal-css', 'true')
  
  // Only inject if not already present
  if (!document.querySelector('[data-critical-modal-css]')) {
    document.head.appendChild(styleElement)
  }
}

// Resource hints for better performance
export function addModalResourceHints() {
  if (typeof document === 'undefined') return

  const hints = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
    { rel: 'preload', href: '/logo.png', as: 'image' },
    { rel: 'preload', href: '/placeholder.jpg', as: 'image' }
  ]

  hints.forEach(hint => {
    const existingHint = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`)
    if (!existingHint) {
      const link = document.createElement('link')
      Object.assign(link, hint)
      document.head.appendChild(link)
    }
  })
}

// Initialize performance optimizations
export function initializeModalPerformance() {
  if (typeof window === 'undefined') return

  // Inject critical CSS
  injectCriticalModalCSS()
  
  // Add resource hints
  addModalResourceHints()
  
  // Track initial performance metrics
  if (window.performance && window.dataLayer) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    window.dataLayer.push({
      event: 'modal_performance_init',
      page_load_time: navigation.loadEventEnd - navigation.fetchStart,
      dom_ready_time: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      timestamp: new Date().toISOString()
    })
  }
}