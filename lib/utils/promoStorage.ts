/**
 * Storage utilities for promo modal state management
 * Handles dismissal state and subscription tracking with expiry
 */

interface StorageItem {
  value: any;
  expiry: number;
}

export class PromoStorage {
  private static readonly DISMISSAL_KEY = 'gl_promo_dismissed';
  private static readonly SUBSCRIPTION_KEY = 'gl_subscribed';
  private static readonly DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  /**
   * Set dismissal state with 7-day expiry
   */
  static setDismissed(campaignId: string = 'iday25'): void {
    try {
      const item: StorageItem = {
        value: { campaignId, dismissed: true },
        expiry: Date.now() + this.DISMISSAL_DURATION
      };
      localStorage.setItem(this.DISMISSAL_KEY, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set dismissal state:', error);
    }
  }

  /**
   * Check if promo has been dismissed and not expired
   */
  static isDismissed(campaignId: string = 'iday25'): boolean {
    try {
      const itemStr = localStorage.getItem(this.DISMISSAL_KEY);
      if (!itemStr) return false;

      const item: StorageItem = JSON.parse(itemStr);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        localStorage.removeItem(this.DISMISSAL_KEY);
        return false;
      }

      // Check if same campaign
      return item.value?.campaignId === campaignId && item.value?.dismissed === true;
    } catch (error) {
      console.warn('Failed to check dismissal state:', error);
      return false;
    }
  }

  /**
   * Set subscription state
   */
  static setSubscribed(email: string): void {
    try {
      const item: StorageItem = {
        value: { email, subscribed: true, timestamp: Date.now() },
        expiry: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
      };
      localStorage.setItem(this.SUBSCRIPTION_KEY, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set subscription state:', error);
    }
  }

  /**
   * Check if user has already subscribed
   */
  static isSubscribed(): boolean {
    try {
      const itemStr = localStorage.getItem(this.SUBSCRIPTION_KEY);
      if (!itemStr) return false;

      const item: StorageItem = JSON.parse(itemStr);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        localStorage.removeItem(this.SUBSCRIPTION_KEY);
        return false;
      }

      return item.value?.subscribed === true;
    } catch (error) {
      console.warn('Failed to check subscription state:', error);
      return false;
    }
  }

  /**
   * Clear all promo-related storage
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(this.DISMISSAL_KEY);
      localStorage.removeItem(this.SUBSCRIPTION_KEY);
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  /**
   * Get subscription email if exists
   */
  static getSubscriptionEmail(): string | null {
    try {
      const itemStr = localStorage.getItem(this.SUBSCRIPTION_KEY);
      if (!itemStr) return null;

      const item: StorageItem = JSON.parse(itemStr);
      
      if (Date.now() > item.expiry) {
        localStorage.removeItem(this.SUBSCRIPTION_KEY);
        return null;
      }

      return item.value?.email || null;
    } catch (error) {
      console.warn('Failed to get subscription email:', error);
      return null;
    }
  }
}

/**
 * Cookie fallback for environments where localStorage is not available
 */
export class PromoCookies {
  private static readonly DISMISSAL_KEY = 'gl_promo_dismissed';
  private static readonly SUBSCRIPTION_KEY = 'gl_subscribed';

  static setDismissed(campaignId: string = 'iday25'): void {
    try {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `${this.DISMISSAL_KEY}=${campaignId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    } catch (error) {
      console.warn('Failed to set dismissal cookie:', error);
    }
  }

  static isDismissed(campaignId: string = 'iday25'): boolean {
    try {
      const cookies = document.cookie.split(';');
      const dismissalCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${this.DISMISSAL_KEY}=`)
      );
      
      if (!dismissalCookie) return false;
      
      const value = dismissalCookie.split('=')[1];
      return value === campaignId;
    } catch (error) {
      console.warn('Failed to check dismissal cookie:', error);
      return false;
    }
  }

  static setSubscribed(email: string): void {
    try {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${this.SUBSCRIPTION_KEY}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    } catch (error) {
      console.warn('Failed to set subscription cookie:', error);
    }
  }

  static isSubscribed(): boolean {
    try {
      const cookies = document.cookie.split(';');
      const subscriptionCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${this.SUBSCRIPTION_KEY}=`)
      );
      
      return subscriptionCookie?.split('=')[1] === 'true';
    } catch (error) {
      console.warn('Failed to check subscription cookie:', error);
      return false;
    }
  }
}

/**
 * Unified storage interface that tries localStorage first, falls back to cookies
 */
export const promoStorage = {
  setDismissed: (campaignId?: string) => {
    if (typeof window !== 'undefined') {
      try {
        PromoStorage.setDismissed(campaignId);
      } catch {
        PromoCookies.setDismissed(campaignId);
      }
    }
  },

  isDismissed: (campaignId?: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      return PromoStorage.isDismissed(campaignId);
    } catch {
      return PromoCookies.isDismissed(campaignId);
    }
  },

  setSubscribed: (email: string) => {
    if (typeof window !== 'undefined') {
      try {
        PromoStorage.setSubscribed(email);
      } catch {
        PromoCookies.setSubscribed(email);
      }
    }
  },

  isSubscribed: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      return PromoStorage.isSubscribed();
    } catch {
      return PromoCookies.isSubscribed();
    }
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      PromoStorage.clearAll();
    }
  },

  getSubscriptionEmail: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return PromoStorage.getSubscriptionEmail();
    } catch {
      return null;
    }
  }
};