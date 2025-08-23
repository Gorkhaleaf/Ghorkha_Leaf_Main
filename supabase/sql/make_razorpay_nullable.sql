-- SQL to run in Supabase SQL editor to allow provisional inserts
BEGIN;

-- Allow provisional inserts without a payment id
ALTER TABLE public.orders
  ALTER COLUMN razorpay_payment_id DROP NOT NULL;

-- Add index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);

COMMIT;

-- Verification query (replace with your order id)
SELECT id, user_id, amount, currency, items, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE razorpay_order_id = 'order_R8hk95WdUh3TIe';