/**
 * Promo Modal - Main exports
 * Provides easy access to all promo modal components and utilities
 */

// Main components
export { PromoModal } from './PromoModal'
export { 
  PromoModalProvider, 
  usePromoModal, 
  usePromoModalTrigger,
  PromoModalTrigger,
  resetPromoModalState,
  shouldShowPromoModal,
  promoModalConfig
} from './PromoModalProvider'

// Utility functions
export { promoStorage, PromoStorage, PromoCookies } from '@/lib/utils/promoStorage'
export { 
  subscribeToNewsletter, 
  isValidEmail, 
  getEmailDomain, 
  getEmailProvider,
  NewsletterApiClient 
} from '@/lib/utils/newsletterApi'
export { 
  applyCoupon, 
  removeCoupon,
  isValidCouponCode,
  calculateDiscount,
  formatDiscountText,
  formatCurrency,
  CouponApiClient 
} from '@/lib/utils/couponApi'
export { 
  PromoAnalytics,
  initializePromoAnalytics,
  trackPromoImpression,
  trackPromoSubmit,
  trackPromoDismiss,
  trackCouponApplied,
  trackNewsletterSubscription,
  trackFormError,
  trackModalTiming,
  trackUserJourney,
  trackVariantExposure,
  trackPerformanceMetrics
} from '@/lib/utils/analytics'

// Types
export type { PromoModalProps } from './PromoModal'
export type { 
  NewsletterSubscriptionRequest,
  NewsletterSubscriptionResponse 
} from '@/lib/utils/newsletterApi'
export type { 
  CouponApplicationRequest,
  CouponApplicationResponse 
} from '@/lib/utils/couponApi'
export type { 
  PromoAnalyticsEvent 
} from '@/lib/utils/analytics'