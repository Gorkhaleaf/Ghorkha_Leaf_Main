-- supabase/sql/add_user_uid_fk_to_orders.sql
BEGIN;

-- Add user_uid column if it doesn't already exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_uid uuid;

-- Backfill from existing user_id where possible (attempt cast to uuid)
UPDATE public.orders
SET user_uid = user_id::uuid
WHERE user_uid IS NULL AND user_id IS NOT NULL;

-- Index to speed up joins/queries by user_uid
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON public.orders (user_uid);

-- Add FK constraint linking orders.user_uid -> auth.users.id (set NULL on delete)
ALTER TABLE public.orders
  ADD CONSTRAINT IF NOT EXISTS fk_orders_user_uid
  FOREIGN KEY (user_uid) REFERENCES auth.users(id) ON DELETE SET NULL;

COMMIT;

-- Verification queries to run after applying the migration:

-- Check a specific order
SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE razorpay_order_id = 'order_R8iHLoOW66kANy';

-- Find unclaimed orders that have a payment id (candidates for claim)
SELECT id, user_id, user_uid, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE user_uid IS NULL AND razorpay_payment_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 50;

-- If the automatic cast in the UPDATE fails (non-UUID values in user_id), run a safe text-copy backfill:
-- WARNING: only run if you understand that this copies textual user_id values into user_uid (may be invalid UUIDs).
-- Uncomment and run if appropriate:
-- BEGIN;
-- UPDATE public.orders SET user_uid = user_id WHERE user_uid IS NULL AND user_id IS NOT NULL;
-- COMMIT;