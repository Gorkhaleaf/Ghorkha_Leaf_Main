# Razorpay Implementation Guide - Standard Patterns

## Overview
This document explains the standard patterns for implementing Razorpay with orders and user authentication, based on the official Razorpay Node.js SDK documentation.

## Standard Razorpay Order Flow

### 1. Order Creation (Frontend)
```javascript
// Standard order creation in checkout
const createOrder = async () => {
  const response = await fetch('/api/razorpay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}` // Include auth token
    },
    body: JSON.stringify({
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      items: cartItems,
      user_id: user.id // Current authenticated user
    })
  });

  const order = await response.json();
  return order;
};
```

### 2. Order Creation (Backend API)
```javascript
// Standard order creation in /api/razorpay
export async function POST(req: NextRequest) {
  const { amount, currency, items, user_id } = await req.json();

  // Create Razorpay order
  const razorpayOrder = await instance.orders.create({
    amount: amount,
    currency: currency,
    receipt: `receipt_${Date.now()}`,
    notes: {
      user_id: user_id, // Store user reference
      items_count: items.length
    }
  });

  return NextResponse.json(razorpayOrder);
}
```

### 3. Payment Processing (Frontend)
```javascript
// Standard payment processing
const handlePayment = async () => {
  const order = await createOrder();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: 'Your Company',
    description: 'Order Payment',
    handler: async function (response) {
      // Save order details to your database
      await saveOrder({
        user_id: currentUser.id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: order.amount / 100,
        currency: order.currency,
        status: 'success',
        items: cartItems
      });
    },
    prefill: {
      name: currentUser.name,
      email: currentUser.email, // Use real user data
      contact: currentUser.phone
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
```

### 4. Order Storage (Backend)
```javascript
// Standard order storage in /api/orders
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const {
    user_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    status,
    items
  } = await req.json();

  // Verify user authentication
  if (user_id !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Get user profile data
  const profile = await getUserProfile(session.user.id);

  // Store order with real user data
  const order = await db.orders.create({
    data: {
      user_id: session.user.id, // Link to authenticated user
      customer_email: profile?.email || session.user.email,
      customer_phone: profile?.phone || session.user.phone,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      status,
      items
    }
  });

  return NextResponse.json({ success: true, order });
}
```

## Key Implementation Patterns

### 1. Authentication Integration
- **Always verify user authentication** before creating orders
- **Use JWT tokens** for API authentication
- **Validate user_id** matches authenticated user
- **Store user reference** in order metadata

### 2. Customer Data Handling
- **Primary**: Get customer data from user profile/database
- **Secondary**: Extract from JWT token if profile unavailable
- **Fallback**: Use session user data as last resort
- **Never use generic data** like "customer@example.com"

### 3. Order Linking
- **Option 1**: Link via `user_id` (requires user table)
- **Option 2**: Link via `email_canonical` (email-based linking)
- **Option 3**: Link via `customer_id` (Razorpay customer ID)

### 4. Database Schema
```sql
-- Standard orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id), -- Link to auth user
  customer_email text,
  customer_phone text,
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  razorpay_signature text,
  amount decimal(10,2),
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending',
  items jsonb,
  created_at timestamp DEFAULT now()
);

-- Alternative: Email-based linking
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email_canonical text, -- Link via email
  customer_email text,
  customer_phone text,
  -- ... other fields
  FOREIGN KEY (customer_email_canonical)
  REFERENCES profiles(email_canonical)
);
```

## Current Implementation Issues

### 1. Missing Real Customer Data
- Orders are being created with `customer_email: null`
- No fallback to JWT token email
- Profile lookup is failing

### 2. Authentication Flow
- User authentication is not being properly validated
- JWT token parsing might be failing
- Session user data not being used

### 3. Database Linking
- Orders are not being linked to authenticated users
- Email canonical fields are not being populated
- Foreign key constraints are causing failures

## Recommended Fixes

### 1. Enhanced Customer Data Extraction
```javascript
// In orders API - get real customer data
const getCustomerData = async (session) => {
  // Try profile first
  const profile = await getUserProfile(session.user.id);
  if (profile?.email) {
    return { email: profile.email, phone: profile.phone };
  }

  // Try JWT token
  const token = extractTokenFromRequest(req);
  const payload = decodeJwtPayload(token);
  if (payload?.email) {
    return { email: payload.email, phone: payload.phone };
  }

  // Try Supabase auth
  const authUser = await getUserFromSupabase(session.user.id);
  if (authUser?.email) {
    return { email: authUser.email, phone: authUser.phone };
  }

  // Return null if nothing found
  return { email: null, phone: null };
};
```

### 2. Proper Order Creation Flow
```javascript
// In checkout page
const handlePayment = async () => {
  if (!user) {
    // Require authentication
    setShowAuthModal(true);
    return;
  }

  // Create order with real user data
  const order = await createOrder({
    amount: totalAmount,
    currency: 'INR',
    items: cartItems,
    user_id: user.id, // Real authenticated user
    customer_email: user.email, // Real email
    customer_phone: user.phone // Real phone
  });
};
```

### 3. Database Migration Strategy
```sql
-- Remove problematic constraints
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_email_canonical_fkey;

-- Add proper linking (optional)
-- ALTER TABLE orders ADD COLUMN user_id uuid REFERENCES auth.users(id);
-- UPDATE orders SET user_id = (SELECT id FROM profiles WHERE email_canonical = orders.customer_email_canonical);
```

## Testing Checklist

- [ ] User authentication works properly
- [ ] JWT tokens contain user email
- [ ] Profile data is accessible
- [ ] Orders are created with real customer data
- [ ] Order retrieval works for authenticated users
- [ ] Webhook processing doesn't fail
- [ ] Database constraints don't block operations

## Next Steps

1. **Test the enhanced logging** to see where the customer data extraction is failing
2. **Check JWT token structure** to ensure email is present
3. **Verify profile creation** is working for new users
4. **Test the complete flow** from authentication to order completion
5. **Monitor webhook processing** to ensure no failures

This implementation follows the standard Razorpay patterns while ensuring proper user authentication and data linking.