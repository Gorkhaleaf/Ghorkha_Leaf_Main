-- Migration: make razorpay_payment_id nullable and add index on razorpay_order_id
-- Reason: provisional pre-create inserts do not have a payment id yet
-- Run this migration with your usual Supabase migration workflow or paste the SQL into the Supabase SQL editor.

BEGIN;

-- Allow provisional inserts without a payment id
ALTER TABLE public.orders
  ALTER COLUMN razorpay_payment_id DROP NOT NULL;

-- Add an index to speed up lookups by razorpay_order_id (used by webhook)
CREATE INDEX idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);

COMMIT;

-- Verification query you can run after applying migration:
-- SELECT id, user_id, amount, currency, items, razorpay_order_id, razorpay_payment_id, status, created_at
-- FROM public.orders
-- WHERE razorpay_order_id = 'order_R8hk95WdUh3TIe';