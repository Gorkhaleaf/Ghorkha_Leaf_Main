-- Run this migration in the Supabase SQL editor
BEGIN;
-- Add column for FK to auth.users
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_uid uuid;
-- Backfill from existing user_id when it's a valid UUID
UPDATE public.orders
SET user_uid = user_id::uuid
WHERE user_uid IS NULL AND user_id IS NOT NULL;
-- Index for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON public.orders (user_uid);
-- Add FK constraint (set NULL on user delete)
ALTER TABLE public.orders
  ADD CONSTRAINT fk_orders_user_uid FOREIGN KEY (user_uid) REFERENCES auth.users(id) ON DELETE SET NULL;
COMMIT;

-- Verification queries
SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE razorpay_order_id = 'order_R8iHLoOW66kANy';

SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE user_uid IS NULL AND razorpay_payment_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 50;

-- Optional: if automatic cast fails and you have confirmed it's safe:
-- UPDATE public.orders SET user_uid = user_id WHERE user_uid IS NULL AND user_id IS NOT NULL;