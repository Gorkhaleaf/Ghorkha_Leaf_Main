"use client"

import React, { useState, useEffect, useRef } from 'react'
import './promo-modal.css'
import { X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/context/CartContext'
import { promoStorage } from '@/lib/utils/promoStorage'
import { subscribeToNewsletter, isValidEmail, getEmailDomain } from '@/lib/utils/newsletterApi'
import { applyCoupon } from '@/lib/utils/couponApi'
import { PromoAnalytics } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils'

export interface PromoModalProps {
  isOpen: boolean
  onClose: () => void
  heroImageSrc?: string
  logoSrc?: string
  couponCode?: string
  campaignId?: string
  variant?: string
}

export function PromoModal({
  isOpen,
  onClose,
  heroImageSrc = '/placeholder.jpg',
  logoSrc = '/logo.png',
  couponCode = 'IDAY30',
  campaignId = 'iday25',
  variant = 'A'
}: PromoModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const noThanksButtonRef = useRef<HTMLButtonElement>(null)
  
  const { toast } = useToast()
  const { applyCoupon: applyCartCoupon } = useCart()
  const analyticsRef = useRef<PromoAnalytics | null>(null)

  // Initialize analytics
  useEffect(() => {
    if (isOpen && !analyticsRef.current) {
      analyticsRef.current = new PromoAnalytics(campaignId, variant)
      analyticsRef.current.trackImpression()
    }
  }, [isOpen, campaignId, variant])

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
      
      // Focus management
      setTimeout(() => {
        emailInputRef.current?.focus()
      }, 100)
    } else {
      setIsVisible(false)
      // Restore body scroll
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        handleClose('escape_key')
      }

      // Focus trap
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, input, [tabindex]:not([tabindex="-1"])'
        )
        
        if (!focusableElements?.length) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleClose = (method: 'close_button' | 'overlay_click' | 'escape_key' | 'no_thanks_button' = 'close_button') => {
    analyticsRef.current?.trackDismiss(method)
    promoStorage.setDismissed(campaignId)
    onClose()
  }

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose('overlay_click')
    }
  }

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setEmailError('Email is required')
      return false
    }

    if (!isValidEmail(emailValue)) {
      setEmailError('Please enter a valid email address')
      return false
    }

    setEmailError('')
    return true
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
    
    // Clear error on typing
    if (emailError && value.trim()) {
      setEmailError('')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateEmail(email)) {
      analyticsRef.current?.trackError('invalid_email', emailError)
      emailInputRef.current?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      // Subscribe to newsletter
      const newsletterResponse = await subscribeToNewsletter(email, `promo_modal_${campaignId}`)
      
      if (!newsletterResponse.success) {
        throw new Error(newsletterResponse.message)
      }

      // Apply coupon
      const couponResponse = await applyCoupon(couponCode)
      
      if (couponResponse.success) {
        // Update cart context
        applyCartCoupon(couponCode)
        
        // Track success events
        analyticsRef.current?.trackSubmit(email)
        analyticsRef.current?.trackNewsletterSuccess(email, `promo_modal_${campaignId}`)
        analyticsRef.current?.trackCouponSuccess(couponCode, couponResponse.data?.discountAmount || 0)
        
        // Store subscription state
        promoStorage.setSubscribed(email)
        promoStorage.setDismissed(campaignId)
        
        // Show success toast
        toast({
          title: "Success!",
          description: `${couponCode} applied! You'll save 30% on your order.`,
          duration: 5000,
        })
        
        onClose()
      } else {
        throw new Error(couponResponse.message || 'Failed to apply coupon')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      analyticsRef.current?.trackError('api_error', errorMessage)
      
      setEmailError(errorMessage)
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleOverlayClick}
        role="presentation"
      />
      
      {/* Modal Container */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-[9991] w-full max-w-[920px] mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl",
          "transform transition-all duration-300 ease-out",
          "grid grid-cols-1 md:grid-cols-2 max-h-[88vh]",
          // Mobile-specific sizing
          "sm:max-w-[480px] max-h-[85vh] sm:max-h-[80vh]",
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
        aria-describedby="promo-modal-description"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={() => handleClose('close_button')}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[9992] w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-black/10 shadow-lg flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* Image Pane */}
        <div className="relative min-h-[180px] sm:min-h-[200px] md:min-h-[260px] bg-brand-beige order-1 md:order-2">
          <Image
            src={heroImageSrc}
            alt="Independence Day Sale - Tea cup with tricolor background"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Content Pane */}
        <div className="p-4 sm:p-5 md:p-8 bg-brand-beige order-2 md:order-1 overflow-y-auto">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src={logoSrc}
              alt="Gorkha Leaf"
              width={120}
              height={36}
              className="h-7 w-auto"
            />
          </div>

          {/* Content */}
          <div className="space-y-2 sm:space-y-3">
            <h1
              id="promo-modal-title"
              className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wider"
            >
              Independence Day SALE
            </h1>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                FLAT
              </p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-600 leading-none tracking-tight">
                30% OFF
              </p>
              <p className="text-xs font-bold text-brand-green uppercase tracking-wide">
                SITEWIDE
              </p>
            </div>

            <p
              id="promo-modal-description"
              className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4"
            >
              Share your email for exciting offers!
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Input
                    ref={emailInputRef}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    className={cn(
                      "flex-1 h-10 sm:h-12 px-3 sm:px-4 border rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base",
                      emailError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-brand-green focus:border-brand-green"
                    )}
                    disabled={isSubmitting}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  <Button
                    ref={continueButtonRef}
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="h-10 sm:h-12 px-4 sm:px-6 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg sm:rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Please wait...' : 'Continue'}
                  </Button>
                </div>
                
                {emailError && (
                  <p id="email-error" className="text-sm text-red-600 font-medium">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Secondary CTA */}
              <div className="pt-2">
                <button
                  ref={noThanksButtonRef}
                  type="button"
                  onClick={() => handleClose('no_thanks_button')}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
                >
                  No, thanks
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// CSS for body scroll lock
const modalStyles = `
  .modal-open {
    overflow: hidden !important;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .promo-modal * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = modalStyles
  document.head.appendChild(styleElement)
}