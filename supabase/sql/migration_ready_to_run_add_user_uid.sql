-- Migration: add user_uid FK to orders (paste into Supabase SQL editor and run)
BEGIN;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_uid uuid;
UPDATE public.orders SET user_uid = user_id::uuid WHERE user_uid IS NULL AND user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON public.orders (user_uid);
ALTER TABLE public.orders ADD CONSTRAINT fk_orders_user_uid FOREIGN KEY (user_uid) REFERENCES auth.users(id) ON DELETE SET NULL;
COMMIT;

-- Verification queries (run after migration)
SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE razorpay_order_id = 'order_R8iHLoOW66kANy';

SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE user_uid IS NULL AND razorpay_payment_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 50;

-- Note:
-- If the automatic cast (user_id::uuid) fails because user_id contains non-UUID values,
-- run the safe text-copy backfill only after confirming it's acceptable:
-- UPDATE public.orders SET user_uid = user_id WHERE user_uid IS NULL AND user_id IS NOT NULL;