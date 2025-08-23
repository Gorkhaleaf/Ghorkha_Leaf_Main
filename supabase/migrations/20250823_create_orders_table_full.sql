-- Migration: create orders table (safe)
-- Run in psql or Supabase SQL editor. Requires pgcrypto extension for gen_random_uuid().

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create orders table if missing
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_id uuid,
  amount numeric(12,2),
  currency text DEFAULT 'INR',
  items jsonb DEFAULT '[]'::jsonb,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text DEFAULT 'pending',
  customer_email text,
  customer_email_canonical text,
  customer_phone text,
  customer_phone_normalized text,
  created_at timestamptz DEFAULT now()
);

-- Indexes (create concurrently outside transactions if DB is large)
CREATE INDEX IF NOT EXISTS orders_user_uid_idx ON public.orders (user_uid);
-- Use CONCURRENTLY in production for large tables:
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS orders_customer_email_canonical_idx ON public.orders (customer_email_canonical) WHERE customer_email_canonical IS NOT NULL;
CREATE INDEX IF NOT EXISTS orders_razorpay_order_id_idx ON public.orders (razorpay_order_id);

-- Notes:
-- * If your Postgres does not support gen_random_uuid(), use uuid_generate_v4() and enable "uuid-ossp".
-- * Run CREATE INDEX CONCURRENTLY for customer_email_canonical in production to avoid table locks.
-- * After creating, apply FK from customer_email_canonical -> profiles(email_canonical) via a separate migration with NOT VALID then VALIDATE.