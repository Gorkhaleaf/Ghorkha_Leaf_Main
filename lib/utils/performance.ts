// Performance optimization utilities

// Lazy load images with intersection observer
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement
        target.src = src
        target.classList.add('loaded')
        observer.unobserve(target)
      }
    })
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  })

  observer.observe(img)
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = href

  if (type) {
    link.type = type
  }

  document.head.appendChild(link)
}

// Check if device is low performance
export function isLowPerformanceDevice(): boolean {
  if (typeof window === 'undefined') return false

  const connection = (navigator as any).connection
  const isSlowConnection = connection &&
    (connection.effectiveType === 'slow-2g' ||
     connection.effectiveType === '2g' ||
     connection.effectiveType === '3g')

  const isLowEndDevice = navigator.hardwareConcurrency <= 2 ||
                        window.devicePixelRatio < 1

  return isSlowConnection || isLowEndDevice
}

// Optimize animations based on device performance
export function getAnimationConfig() {
  const isLowPerf = isLowPerformanceDevice()

  return {
    duration: isLowPerf ? 0.3 : 0.6,
    ease: isLowPerf ? 'power2.out' : 'power3.out',
    stagger: isLowPerf ? 0.05 : 0.1,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}

// Memory usage monitoring (for development)
export function logMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return

  const memInfo = (performance as any).memory
  console.log('Memory Usage:', {
    used: Math.round(memInfo.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
    total: Math.round(memInfo.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
    limit: Math.round(memInfo.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB'
  })
}

// Performance measurement utility
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined') return fn()

  const start = performance.now()
  const result = fn()
  const end = performance.now()

  console.log(`${name} took ${Math.round((end - start) * 100) / 100}ms`)
  return result
}