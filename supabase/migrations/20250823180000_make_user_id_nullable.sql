-- Migration: make user_id nullable to allow webhook/provisional inserts
-- Reason: webhook may create provisional orders before a user_id is available; NOT NULL prevents inserts.
-- Run this with your Supabase migration workflow or paste into the SQL editor.

BEGIN;

ALTER TABLE public.orders
  ALTER COLUMN user_id DROP NOT NULL;

COMMIT;

-- Verification:
-- SELECT id, user_id, amount, currency, items, razorpay_order_id, razorpay_payment_id, status, created_at
-- FROM public.orders
-- WHERE razorpay_order_id = 'order_R8iFMdG95NW6La';