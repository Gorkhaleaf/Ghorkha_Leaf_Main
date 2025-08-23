"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { PromoModal } from './PromoModal'
import { promoStorage } from '@/lib/utils/promoStorage'

interface PromoModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  isModalAvailable: boolean
}

const PromoModalContext = createContext<PromoModalContextType | undefined>(undefined)

export function usePromoModal() {
  const context = useContext(PromoModalContext)
  if (!context) {
    throw new Error('usePromoModal must be used within a PromoModalProvider')
  }
  return context
}

interface PromoModalProviderProps {
  children: React.ReactNode
  heroImageSrc?: string
  logoSrc?: string
  couponCode?: string
  campaignId?: string
  variant?: string
  autoTriggerDelay?: number
  disabled?: boolean
}

export function PromoModalProvider({
  children,
  heroImageSrc = '/placeholder.jpg',
  logoSrc = '/logo.png',
  couponCode = 'IDAY30',
  campaignId = 'iday25',
  variant = 'A',
  autoTriggerDelay = 2000,
  disabled = false
}: PromoModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalAvailable, setIsModalAvailable] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  // Check if modal should be available
  const checkModalAvailability = useCallback(() => {
    if (disabled) {
      setIsModalAvailable(false)
      return false
    }

    // Check if already dismissed
    if (promoStorage.isDismissed(campaignId)) {
      setIsModalAvailable(false)
      return false
    }

    // Check if already subscribed
    if (promoStorage.isSubscribed()) {
      setIsModalAvailable(false)
      return false
    }

    setIsModalAvailable(true)
    return true
  }, [disabled, campaignId])

  // Initialize modal availability
  useEffect(() => {
    // Small delay to ensure client-side hydration
    const timer = setTimeout(() => {
      checkModalAvailability()
    }, 100)

    return () => clearTimeout(timer)
  }, [checkModalAvailability])

  // Auto-trigger modal after delay
  useEffect(() => {
    if (!isModalAvailable || hasTriggered || isOpen) {
      return
    }

    const timer = setTimeout(() => {
      setIsOpen(true)
      setHasTriggered(true)
    }, autoTriggerDelay)

    return () => clearTimeout(timer)
  }, [isModalAvailable, hasTriggered, isOpen, autoTriggerDelay])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If user comes back to tab and modal hasn't been triggered yet, trigger it
      if (document.visibilityState === 'visible' && isModalAvailable && !hasTriggered && !isOpen) {
        const timer = setTimeout(() => {
          setIsOpen(true)
          setHasTriggered(true)
        }, 1000) // Shorter delay when returning to tab

        return () => clearTimeout(timer)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isModalAvailable, hasTriggered, isOpen])

  // Handle scroll-based trigger (alternative trigger method)
  useEffect(() => {
    if (!isModalAvailable || hasTriggered || isOpen) {
      return
    }

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      // Clear existing timeout
      clearTimeout(scrollTimeout)
      
      // Set new timeout - trigger modal if user stops scrolling for 3 seconds
      scrollTimeout = setTimeout(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        
        // Trigger if user has scrolled at least 25% down the page
        if (scrollPercent > 25) {
          setIsOpen(true)
          setHasTriggered(true)
        }
      }, 3000)
    }

    // Only add scroll listener if auto-trigger delay is very long or disabled
    if (autoTriggerDelay > 10000) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isModalAvailable, hasTriggered, isOpen, autoTriggerDelay])

  // Handle exit intent (mouse leaving viewport)
  useEffect(() => {
    if (!isModalAvailable || hasTriggered || isOpen) {
      return
    }

    const handleMouseLeave = (event: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (event.clientY <= 0) {
        setIsOpen(true)
        setHasTriggered(true)
      }
    }

    // Only add exit intent if auto-trigger delay is disabled or very long
    if (autoTriggerDelay > 15000 || autoTriggerDelay === 0) {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [isModalAvailable, hasTriggered, isOpen, autoTriggerDelay])

  const openModal = useCallback(() => {
    if (isModalAvailable) {
      setIsOpen(true)
      setHasTriggered(true)
    }
  }, [isModalAvailable])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Re-check availability when modal closes (in case storage state changed)
  useEffect(() => {
    if (!isOpen && hasTriggered) {
      // Small delay to allow storage operations to complete
      const timer = setTimeout(() => {
        checkModalAvailability()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, hasTriggered, checkModalAvailability])

  const contextValue: PromoModalContextType = {
    isOpen,
    openModal,
    closeModal,
    isModalAvailable
  }

  return (
    <PromoModalContext.Provider value={contextValue}>
      {children}
      {isModalAvailable && (
        <PromoModal
          isOpen={isOpen}
          onClose={closeModal}
          heroImageSrc={heroImageSrc}
          logoSrc={logoSrc}
          couponCode={couponCode}
          campaignId={campaignId}
          variant={variant}
        />
      )}
    </PromoModalContext.Provider>
  )
}

// Hook for manually triggering modal (for testing or special cases)
export function usePromoModalTrigger() {
  const { openModal, isModalAvailable } = usePromoModal()
  
  return {
    triggerModal: openModal,
    canTrigger: isModalAvailable
  }
}

// Component for manual trigger button (development/testing)
export function PromoModalTrigger({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const { triggerModal, canTrigger } = usePromoModalTrigger()

  if (!canTrigger) {
    return null
  }

  return (
    <button 
      onClick={triggerModal}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
}

// Utility function to reset modal state (for testing)
export function resetPromoModalState(campaignId: string = 'iday25') {
  if (typeof window !== 'undefined') {
    promoStorage.clearAll()
    // Force page reload to reset state
    window.location.reload()
  }
}

// Utility function to check if modal should show (for SSR compatibility)
export function shouldShowPromoModal(campaignId: string = 'iday25'): boolean {
  if (typeof window === 'undefined') {
    return false // Don't show on server
  }

  return !promoStorage.isDismissed(campaignId) && !promoStorage.isSubscribed()
}

// Configuration object for easy customization
export const promoModalConfig = {
  campaigns: {
    iday25: {
      campaignId: 'iday25',
      couponCode: 'IDAY30',
      heroImageSrc: '/placeholder.jpg',
      autoTriggerDelay: 2000,
      variant: 'A'
    },
    // Add more campaigns here
    welcome: {
      campaignId: 'welcome',
      couponCode: 'WELCOME20',
      heroImageSrc: '/welcome-hero.jpg',
      autoTriggerDelay: 5000,
      variant: 'B'
    }
  },
  
  // Global settings
  settings: {
    respectReducedMotion: true,
    enableExitIntent: true,
    enableScrollTrigger: true,
    maxTriggersPerSession: 1
  }
}