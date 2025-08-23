-- Migration: add user_uid FK to orders (paste into Supabase SQL editor and run)

BEGIN;

-- 1) Add new UUID column to reference auth.users(id)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_uid uuid;

-- 2) Backfill from existing user_id when it is a valid UUID (attempt cast)
UPDATE public.orders
SET user_uid = user_id::uuid
WHERE user_uid IS NULL AND user_id IS NOT NULL;

-- 3) Create index to speed up joins/filters on user_uid
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON public.orders (user_uid);

-- 4) Add FK constraint if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_orders_user_uid') THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT fk_orders_user_uid
      FOREIGN KEY (user_uid) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

COMMIT;

-- VERIFICATION (run after migration completes):
-- [`SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at FROM public.orders WHERE razorpay_order_id = 'order_R8iHLoOW66kANy';`](supabase/sql/final_migration_user_uid.sql:27)

-- SAFE FALLBACK (only if the automatic cast UPDATE above failed because user_id contains non-UUID strings):
-- 1) Inspect distinct user_id values that couldn't be cast:
--    SELECT DISTINCT user_id FROM public.orders WHERE user_uid IS NULL AND user_id IS NOT NULL LIMIT 100;
-- 2) If those values are valid UUID strings stored as text, run the text-copy backfill:
--    UPDATE public.orders SET user_uid = user_id WHERE user_uid IS NULL AND user_id IS NOT NULL;
-- 3) If user_id contains external/non-UUID ids, do NOT run the text-copy. Instead map external ids to auth.users.id or use the claim endpoint.