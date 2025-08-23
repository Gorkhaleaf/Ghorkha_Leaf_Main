/**
 * Coupon application API utilities
 * Handles coupon validation and application with proper error handling
 */

export interface CouponApplicationRequest {
  couponCode: string;
  cartTotal?: number;
  userId?: string;
}

export interface CouponApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    couponCode: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    originalTotal: number;
    finalTotal: number;
    applied: boolean;
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class CouponApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'CouponApiError';
  }
}

/**
 * Apply coupon code to cart
 */
export async function applyCoupon(
  couponCode: string,
  cartTotal: number = 0
): Promise<CouponApplicationResponse> {
  try {
    // Validate coupon code format
    if (!isValidCouponCode(couponCode)) {
      throw new CouponApiError(
        'Please enter a valid coupon code',
        'INVALID_COUPON_FORMAT'
      );
    }

    const requestBody: CouponApplicationRequest = {
      couponCode: couponCode.toUpperCase().trim(),
      cartTotal
    };

    const response = await fetch('/api/cart/apply-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new CouponApiError(
        data.message || 'Failed to apply coupon',
        data.error?.code || 'COUPON_APPLICATION_FAILED',
        response.status,
        data.error?.details
      );
    }

    return {
      success: true,
      message: data.message || 'Coupon applied successfully',
      data: {
        couponCode: requestBody.couponCode,
        applied: true,
        timestamp: new Date().toISOString(),
        ...data.data
      }
    };

  } catch (error) {
    if (error instanceof CouponApiError) {
      return {
        success: false,
        message: error.message,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to connect to server'
        }
      };
    }

    // Handle unexpected errors
    console.error('Unexpected coupon application error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Validate coupon code format
 */
export function isValidCouponCode(couponCode: string): boolean {
  // Basic validation: alphanumeric, 3-20 characters
  const couponRegex = /^[A-Z0-9]{3,20}$/i;
  return couponRegex.test(couponCode.trim());
}

/**
 * Calculate discount amount based on coupon data
 */
export function calculateDiscount(
  originalTotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return Math.round((originalTotal * discountValue / 100) * 100) / 100;
  } else {
    return Math.min(discountValue, originalTotal);
  }
}

/**
 * Mock coupon validation for development/testing
 */
export function createMockCouponResponse(
  couponCode: string,
  cartTotal: number,
  shouldSucceed: boolean = true
): CouponApplicationResponse {
  const normalizedCode = couponCode.toUpperCase().trim();
  
  // Mock coupon database
  const mockCoupons: Record<string, { discountType: 'percentage' | 'fixed'; discountValue: number }> = {
    'IDAY30': { discountType: 'percentage', discountValue: 30 },
    'GORKHA10': { discountType: 'percentage', discountValue: 10 },
    'WELCOME20': { discountType: 'percentage', discountValue: 20 },
    'FLAT100': { discountType: 'fixed', discountValue: 100 }
  };

  if (!shouldSucceed || !mockCoupons[normalizedCode]) {
    return {
      success: false,
      message: 'Invalid or expired coupon code',
      error: {
        code: 'INVALID_COUPON',
        message: 'The coupon code you entered is not valid or has expired'
      }
    };
  }

  const coupon = mockCoupons[normalizedCode];
  const discountAmount = calculateDiscount(cartTotal, coupon.discountType, coupon.discountValue);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    success: true,
    message: `${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '₹'} discount applied successfully!`,
    data: {
      couponCode: normalizedCode,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      originalTotal: cartTotal,
      finalTotal,
      applied: true,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Remove applied coupon
 */
export async function removeCoupon(): Promise<CouponApplicationResponse> {
  try {
    const response = await fetch('/api/cart/remove-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new CouponApiError(
        data.message || 'Failed to remove coupon',
        data.error?.code || 'COUPON_REMOVAL_FAILED',
        response.status
      );
    }

    return {
      success: true,
      message: data.message || 'Coupon removed successfully',
      data: {
        couponCode: '',
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        originalTotal: 0,
        finalTotal: 0,
        applied: false,
        timestamp: new Date().toISOString(),
        ...data.data
      }
    };

  } catch (error) {
    if (error instanceof CouponApiError) {
      return {
        success: false,
        message: error.message,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }

    return {
      success: false,
      message: 'Failed to remove coupon',
      error: {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Coupon API client with retry logic
 */
export class CouponApiClient {
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor(maxRetries?: number, retryDelay?: number) {
    if (maxRetries !== undefined) this.maxRetries = maxRetries;
    if (retryDelay !== undefined) this.retryDelay = retryDelay;
  }

  async apply(
    couponCode: string,
    cartTotal: number = 0
  ): Promise<CouponApplicationResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await applyCoupon(couponCode, cartTotal);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on validation errors
        if (error instanceof CouponApiError && error.code === 'INVALID_COUPON_FORMAT') {
          throw error;
        }

        // Don't retry on client errors (4xx)
        if (error instanceof CouponApiError && error.status && error.status < 500) {
          throw error;
        }

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  async remove(): Promise<CouponApplicationResponse> {
    return await removeCoupon();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Format discount display text
 */
export function formatDiscountText(
  discountType: 'percentage' | 'fixed',
  discountValue: number
): string {
  if (discountType === 'percentage') {
    return `${discountValue}% OFF`;
  } else {
    return `₹${discountValue} OFF`;
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}