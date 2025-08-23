-- Migration: add user_uid FK to orders (Postgres / Supabase SQL editor)
-- Paste this into the Supabase SQL editor and run as a single script.

BEGIN;

-- 1) Add the new column (UUID) to reference auth.users(id)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_uid uuid;

-- 2) Backfill from existing user_id when it is a valid UUID
-- (attempt cast; invalid casts will raise an error — see fallback below)
UPDATE public.orders
SET user_uid = user_id::uuid
WHERE user_uid IS NULL AND user_id IS NOT NULL;

-- 3) Create index to speed up joins/filters on user_uid
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON public.orders (user_uid);

-- 4) Add FK constraint if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_orders_user_uid'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT fk_orders_user_uid
      FOREIGN KEY (user_uid) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

COMMIT;

-- VERIFICATION (run after migration completes):

-- Check a specific order by razorpay_order_id
SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE razorpay_order_id = 'order_R8iHLoOW66kANy';

-- List recent unclaimed (no user_uid) orders that have a payment id
SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE user_uid IS NULL AND razorpay_payment_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 50;

-- SAFE FALLBACK (only run if the automatic cast UPDATE above failed because user_id contains non-UUID strings):
-- Inspect distinct non-UUID user_id values:
-- SELECT DISTINCT user_id FROM public.orders WHERE user_uid IS NULL AND user_id IS NOT NULL LIMIT 100;
--
-- If you confirm these values are valid UUID strings stored as text, run the text-copy backfill:
-- BEGIN;
-- UPDATE public.orders
-- SET user_uid = user_id
-- WHERE user_uid IS NULL AND user_id IS NOT NULL;
-- COMMIT;
--
-- If user_id contains non-UUID values (e.g., external ids), DO NOT run the above text-copy; instead:
--  - Identify mapping between those values and auth.users.id, or
--  - Leave user_uid NULL and rely on the claim endpoint / manual reconciliation.