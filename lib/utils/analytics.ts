/**
 * Analytics utilities for promo modal tracking
 * Handles dataLayer events and user interaction tracking
 */

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface PromoAnalyticsEvent {
  event: string;
  promo_id: string;
  promo_variant?: string;
  email_domain?: string;
  timestamp?: string;
  user_agent?: string;
  screen_size?: string;
  dismiss_method?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Push event to dataLayer with error handling
 */
function pushToDataLayer(eventData: any): void {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        ...eventData,
        timestamp: new Date().toISOString()
      });
    } else {
      // Fallback: log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventData);
      }
    }
  } catch (error) {
    console.warn('Failed to push analytics event:', error);
  }
}

/**
 * Get screen size category for analytics
 */
function getScreenSize(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get user agent category
 */
function getUserAgentCategory(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mobile')) return 'mobile';
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet';
  return 'desktop';
}

/**
 * Extract domain from email for privacy-safe analytics
 */
function getEmailDomain(email: string): string {
  try {
    const domain = email.split('@')[1];
    return domain ? domain.toLowerCase() : 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Track promo modal impression
 */
export function trackPromoImpression(
  promoId: string = 'iday25',
  variant: string = 'A'
): void {
  const eventData: PromoAnalyticsEvent = {
    event: 'promo_impression',
    promo_id: promoId,
    promo_variant: variant,
    screen_size: getScreenSize(),
    user_agent: getUserAgentCategory()
  };

  pushToDataLayer(eventData);
}

/**
 * Track promo modal email submission
 */
export function trackPromoSubmit(
  email: string,
  promoId: string = 'iday25',
  variant: string = 'A'
): void {
  const eventData: PromoAnalyticsEvent = {
    event: 'promo_submit',
    promo_id: promoId,
    promo_variant: variant,
    email_domain: getEmailDomain(email),
    screen_size: getScreenSize(),
    user_agent: getUserAgentCategory()
  };

  pushToDataLayer(eventData);
}

/**
 * Track promo modal dismissal
 */
export function trackPromoDismiss(
  promoId: string = 'iday25',
  variant: string = 'A',
  dismissMethod: 'close_button' | 'overlay_click' | 'escape_key' | 'no_thanks_button' = 'close_button'
): void {
  const eventData: PromoAnalyticsEvent = {
    event: 'promo_dismiss',
    promo_id: promoId,
    promo_variant: variant,
    dismiss_method: dismissMethod,
    screen_size: getScreenSize(),
    user_agent: getUserAgentCategory()
  };

  pushToDataLayer(eventData);
}

/**
 * Track coupon application success
 */
export function trackCouponApplied(
  couponCode: string,
  discountAmount: number,
  promoId: string = 'iday25'
): void {
  const eventData = {
    event: 'coupon_applied',
    coupon_code: couponCode,
    discount_amount: discountAmount,
    promo_id: promoId,
    screen_size: getScreenSize()
  };

  pushToDataLayer(eventData);
}

/**
 * Track newsletter subscription success
 */
export function trackNewsletterSubscription(
  email: string,
  source: string = 'promo_modal_iday25'
): void {
  const eventData = {
    event: 'newsletter_subscription',
    email_domain: getEmailDomain(email),
    subscription_source: source,
    screen_size: getScreenSize()
  };

  pushToDataLayer(eventData);
}

/**
 * Track form validation errors
 */
export function trackFormError(
  errorType: 'invalid_email' | 'api_error' | 'network_error',
  errorMessage: string,
  promoId: string = 'iday25'
): void {
  const eventData = {
    event: 'promo_form_error',
    error_type: errorType,
    error_message: errorMessage,
    promo_id: promoId,
    screen_size: getScreenSize()
  };

  pushToDataLayer(eventData);
}

/**
 * Track modal timing events
 */
export function trackModalTiming(
  action: 'modal_loaded' | 'modal_shown' | 'form_submitted',
  duration?: number,
  promoId: string = 'iday25'
): void {
  const eventData = {
    event: 'promo_timing',
    timing_action: action,
    duration_ms: duration,
    promo_id: promoId,
    screen_size: getScreenSize()
  };

  pushToDataLayer(eventData);
}

/**
 * Analytics manager class for centralized tracking
 */
export class PromoAnalytics {
  private promoId: string;
  private variant: string;
  private startTime: number;

  constructor(promoId: string = 'iday25', variant: string = 'A') {
    this.promoId = promoId;
    this.variant = variant;
    this.startTime = Date.now();
  }

  trackImpression(): void {
    trackPromoImpression(this.promoId, this.variant);
  }

  trackSubmit(email: string): void {
    const duration = Date.now() - this.startTime;
    trackPromoSubmit(email, this.promoId, this.variant);
    trackModalTiming('form_submitted', duration, this.promoId);
  }

  trackDismiss(method: 'close_button' | 'overlay_click' | 'escape_key' | 'no_thanks_button'): void {
    const duration = Date.now() - this.startTime;
    trackPromoDismiss(this.promoId, this.variant, method);
    trackModalTiming('modal_shown', duration, this.promoId);
  }

  trackError(errorType: 'invalid_email' | 'api_error' | 'network_error', errorMessage: string): void {
    trackFormError(errorType, errorMessage, this.promoId);
  }

  trackCouponSuccess(couponCode: string, discountAmount: number): void {
    trackCouponApplied(couponCode, discountAmount, this.promoId);
  }

  trackNewsletterSuccess(email: string, source: string): void {
    trackNewsletterSubscription(email, source);
  }
}

/**
 * Initialize analytics with performance tracking
 */
export function initializePromoAnalytics(): PromoAnalytics {
  const analytics = new PromoAnalytics();
  
  // Track when modal component is loaded
  if (typeof window !== 'undefined') {
    trackModalTiming('modal_loaded', undefined);
  }
  
  return analytics;
}

/**
 * Enhanced event tracking with user journey context
 */
export interface UserJourneyContext {
  pageUrl: string;
  referrer: string;
  sessionId: string;
  userId?: string;
  previousActions: string[];
}

/**
 * Track user journey context
 */
export function trackUserJourney(
  action: string,
  context?: Partial<UserJourneyContext>
): void {
  if (typeof window === 'undefined') return;

  const journeyData = {
    event: 'user_journey',
    action,
    page_url: window.location.href,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    ...context
  };

  pushToDataLayer(journeyData);
}

/**
 * A/B test variant tracking
 */
export function trackVariantExposure(
  testName: string,
  variant: string,
  promoId: string = 'iday25'
): void {
  const eventData = {
    event: 'ab_test_exposure',
    test_name: testName,
    variant,
    promo_id: promoId,
    screen_size: getScreenSize()
  };

  pushToDataLayer(eventData);
}

/**
 * Performance metrics tracking
 */
export function trackPerformanceMetrics(): void {
  if (typeof window === 'undefined' || !window.performance) return;

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      event: 'performance_metrics',
      page_load_time: navigation.loadEventEnd - navigation.fetchStart,
      dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      first_paint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      first_contentful_paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    };

    pushToDataLayer(metrics);
  } catch (error) {
    console.warn('Failed to track performance metrics:', error);
  }
}