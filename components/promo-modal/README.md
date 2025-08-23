# Promo Modal Implementation

A comprehensive, responsive, and accessible promo modal system for Gorkha Leaf's Independence Day Sale campaign.

## Overview

The promo modal is a sitewide promotional component that:
- Auto-triggers after 2 seconds on first visit
- Collects email addresses for newsletter subscription
- Automatically applies coupon codes
- Respects user dismissal preferences for 7 days
- Provides full accessibility support
- Tracks analytics events

## Components

### Core Components

1. **PromoModal** (`PromoModal.tsx`)
   - Main modal component with form and content
   - Handles email validation and submission
   - Manages accessibility features (focus trap, ARIA attributes)
   - Integrates with analytics tracking

2. **PromoModalProvider** (`PromoModalProvider.tsx`)
   - Context provider for modal state management
   - Handles auto-trigger logic and timing
   - Manages dismissal state and storage
   - Provides hooks for manual control

### Utility Files

3. **Storage Utilities** (`lib/utils/promoStorage.ts`)
   - Manages dismissal state with 7-day expiry
   - Handles subscription tracking
   - Provides localStorage with cookie fallback

4. **Newsletter API** (`lib/utils/newsletterApi.ts`)
   - Email validation and subscription logic
   - Error handling and retry mechanisms
   - Analytics integration

5. **Coupon API** (`lib/utils/couponApi.ts`)
   - Coupon validation and application
   - Discount calculations
   - Integration with cart context

6. **Analytics** (`lib/utils/analytics.ts`)
   - DataLayer event tracking
   - User journey analytics
   - Performance metrics

## Installation & Setup

### 1. Install Dependencies

The modal uses existing project dependencies:
- React 19
- Next.js 15.2.4
- Tailwind CSS
- Radix UI components
- Lucide React icons

### 2. Add to Layout

```tsx
// app/layout.tsx
import { PromoModalProvider } from '@/components/promo-modal/PromoModalProvider'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <PromoModalProvider
            heroImageSrc="/hero-image.jpg"
            logoSrc="/logo.png"
            couponCode="IDAY30"
            campaignId="iday25"
            variant="A"
            autoTriggerDelay={2000}
          >
            {children}
            <Toaster />
          </PromoModalProvider>
        </CartProvider>
      </body>
    </html>
  )
}
```

### 3. Update Cart Context

The existing CartContext has been extended to support the IDAY30 coupon:

```tsx
// context/CartContext.tsx
const validCoupons = {
  'GORKHA10': 0.1,  // 10% discount
  'IDAY30': 0.3     // 30% discount
};
```

## Configuration

### PromoModalProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heroImageSrc` | string | `/placeholder.jpg` | Hero image for the modal |
| `logoSrc` | string | `/logo.png` | Company logo |
| `couponCode` | string | `IDAY30` | Coupon code to apply |
| `campaignId` | string | `iday25` | Campaign identifier for tracking |
| `variant` | string | `A` | A/B test variant |
| `autoTriggerDelay` | number | `2000` | Delay before auto-trigger (ms) |
| `disabled` | boolean | `false` | Disable modal completely |

### Campaign Configuration

```tsx
// Multiple campaigns support
export const promoModalConfig = {
  campaigns: {
    iday25: {
      campaignId: 'iday25',
      couponCode: 'IDAY30',
      heroImageSrc: '/iday-hero.jpg',
      autoTriggerDelay: 2000,
      variant: 'A'
    },
    welcome: {
      campaignId: 'welcome',
      couponCode: 'WELCOME20',
      heroImageSrc: '/welcome-hero.jpg',
      autoTriggerDelay: 5000,
      variant: 'B'
    }
  }
}
```

## API Endpoints

### Newsletter Subscription

**POST** `/api/newsletter/subscribe`

```json
{
  "email": "user@example.com",
  "source": "promo_modal_iday25"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "data": {
    "email": "user@example.com",
    "subscribed": true,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "source": "promo_modal_iday25",
    "id": "abc123"
  }
}
```

### Coupon Application

**POST** `/api/cart/apply-coupon`

```json
{
  "couponCode": "IDAY30",
  "cartTotal": 1000
}
```

**Response:**
```json
{
  "success": true,
  "message": "30% discount applied successfully!",
  "data": {
    "couponCode": "IDAY30",
    "discountType": "percentage",
    "discountValue": 30,
    "discountAmount": 300,
    "originalTotal": 1000,
    "finalTotal": 700,
    "applied": true,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Usage Examples

### Basic Usage

The modal automatically triggers based on the configuration. No additional code needed.

### Manual Control

```tsx
import { usePromoModal } from '@/components/promo-modal/PromoModalProvider'

function MyComponent() {
  const { openModal, closeModal, isModalAvailable } = usePromoModal()
  
  return (
    <button 
      onClick={openModal}
      disabled={!isModalAvailable}
    >
      Show Promo
    </button>
  )
}
```

### Testing Utilities

```tsx
import { resetPromoModalState } from '@/components/promo-modal/PromoModalProvider'

// Reset modal state for testing
resetPromoModalState('iday25')
```

## Analytics Events

The modal automatically tracks these events to `window.dataLayer`:

### Impression
```javascript
{
  event: 'promo_impression',
  promo_id: 'iday25',
  promo_variant: 'A',
  screen_size: 'desktop',
  user_agent: 'desktop'
}
```

### Email Submission
```javascript
{
  event: 'promo_submit',
  promo_id: 'iday25',
  promo_variant: 'A',
  email_domain: 'gmail.com',
  screen_size: 'desktop'
}
```

### Dismissal
```javascript
{
  event: 'promo_dismiss',
  promo_id: 'iday25',
  promo_variant: 'A',
  dismiss_method: 'close_button',
  screen_size: 'desktop'
}
```

### Coupon Applied
```javascript
{
  event: 'coupon_applied',
  coupon_code: 'IDAY30',
  discount_amount: 300,
  promo_id: 'iday25'
}
```

## Accessibility Features

- **Focus Management**: Automatic focus trap within modal
- **Keyboard Navigation**: Full keyboard support (Tab, Shift+Tab, Escape)
- **ARIA Attributes**: Proper labeling and descriptions
- **Screen Reader Support**: Semantic HTML and announcements
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Responsive Design

### Desktop (≥768px)
- Two-column layout (content left, image right)
- Max width: 920px
- Grid-based layout

### Mobile (<768px)
- Stacked layout (image top, content bottom)
- Full-width with margins
- Touch-optimized buttons (40px minimum)

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari
- Mobile Chrome

## Performance Optimizations

- **Lazy Loading**: Modal assets loaded on demand
- **Critical CSS**: Inline styles for above-the-fold content
- **Image Optimization**: Next.js Image component with proper sizing
- **Bundle Splitting**: Separate chunks for modal code
- **Memory Management**: Proper cleanup on unmount

## Customization

### Styling

The modal uses CSS custom properties for easy theming:

```css
:root {
  --gl-green: #166434;
  --gl-beige: #fcf5ef;
  --modal-border-radius: 16px;
  --modal-max-width: 920px;
}
```

### Content

Update the content directly in the PromoModal component:

```tsx
// Custom content
<h1>Your Custom Sale Title</h1>
<p className="discount-text">50% OFF</p>
<p>Your custom description</p>
```

## Testing

### Unit Tests

```bash
npm test -- promo-modal
```

### E2E Tests

```bash
npm run e2e -- --spec="promo-modal"
```

### Manual Testing Checklist

- [ ] Modal appears after 2 seconds on first visit
- [ ] Email validation works correctly
- [ ] Form submission applies coupon and closes modal
- [ ] Dismissal methods work (X, overlay, ESC, "No thanks")
- [ ] Modal doesn't reappear for 7 days after dismissal
- [ ] Responsive design works on all screen sizes
- [ ] Accessibility features function properly
- [ ] Analytics events are fired correctly

## Troubleshooting

### Modal Not Appearing

1. Check if already dismissed: `promoStorage.isDismissed('iday25')`
2. Check if already subscribed: `promoStorage.isSubscribed()`
3. Verify `disabled` prop is not set to `true`
4. Check browser console for errors

### API Errors

1. Verify API endpoints are accessible
2. Check network tab for request/response details
3. Ensure proper CORS configuration
4. Validate request payload format

### Storage Issues

1. Check if localStorage is available
2. Verify cookie fallback is working
3. Clear storage for testing: `promoStorage.clearAll()`

## Future Enhancements

- [ ] A/B testing framework integration
- [ ] Advanced targeting rules
- [ ] Multiple campaign support
- [ ] Dynamic content loading
- [ ] Advanced analytics integration
- [ ] Internationalization support

## Support

For issues or questions, please refer to:
- Component documentation
- API endpoint documentation
- Analytics tracking guide
- Accessibility guidelines