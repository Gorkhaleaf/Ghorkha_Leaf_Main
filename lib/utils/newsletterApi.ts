/**
 * Newsletter subscription API utilities
 * Handles email subscription with proper error handling and validation
 */

export interface NewsletterSubscriptionRequest {
  email: string;
  source: string;
}

export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    subscribed: boolean;
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class NewsletterApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'NewsletterApiError';
  }
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  source: string = 'promo_modal_iday25'
): Promise<NewsletterSubscriptionResponse> {
  try {
    // Validate email format
    if (!isValidEmail(email)) {
      throw new NewsletterApiError(
        'Please enter a valid email address',
        'INVALID_EMAIL'
      );
    }

    const requestBody: NewsletterSubscriptionRequest = {
      email: email.toLowerCase().trim(),
      source
    };

    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new NewsletterApiError(
        data.message || 'Failed to subscribe to newsletter',
        data.error?.code || 'SUBSCRIPTION_FAILED',
        response.status,
        data.error?.details
      );
    }

    return {
      success: true,
      message: data.message || 'Successfully subscribed to newsletter',
      data: {
        email: requestBody.email,
        subscribed: true,
        timestamp: new Date().toISOString(),
        ...data.data
      }
    };

  } catch (error) {
    if (error instanceof NewsletterApiError) {
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
    console.error('Unexpected newsletter subscription error:', error);
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
 * Validate email format using regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Extract domain from email for analytics
 */
export function getEmailDomain(email: string): string {
  try {
    const domain = email.split('@')[1];
    return domain ? domain.toLowerCase() : 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Check if email is from a common provider (for analytics)
 */
export function getEmailProvider(email: string): string {
  const domain = getEmailDomain(email);
  
  const providers: Record<string, string> = {
    'gmail.com': 'gmail',
    'yahoo.com': 'yahoo',
    'hotmail.com': 'hotmail',
    'outlook.com': 'outlook',
    'icloud.com': 'icloud',
    'protonmail.com': 'protonmail',
    'aol.com': 'aol'
  };

  return providers[domain] || 'other';
}

/**
 * Mock API response for development/testing
 */
export function createMockNewsletterResponse(
  email: string,
  shouldSucceed: boolean = true
): NewsletterSubscriptionResponse {
  if (shouldSucceed) {
    return {
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email,
        subscribed: true,
        timestamp: new Date().toISOString()
      }
    };
  } else {
    return {
      success: false,
      message: 'Email already subscribed',
      error: {
        code: 'ALREADY_SUBSCRIBED',
        message: 'This email is already subscribed to our newsletter'
      }
    };
  }
}

/**
 * Newsletter API client with retry logic
 */
export class NewsletterApiClient {
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor(maxRetries?: number, retryDelay?: number) {
    if (maxRetries !== undefined) this.maxRetries = maxRetries;
    if (retryDelay !== undefined) this.retryDelay = retryDelay;
  }

  async subscribe(
    email: string,
    source: string = 'promo_modal_iday25'
  ): Promise<NewsletterSubscriptionResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await subscribeToNewsletter(email, source);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on validation errors
        if (error instanceof NewsletterApiError && error.code === 'INVALID_EMAIL') {
          throw error;
        }

        // Don't retry on client errors (4xx)
        if (error instanceof NewsletterApiError && error.status && error.status < 500) {
          throw error;
        }

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}