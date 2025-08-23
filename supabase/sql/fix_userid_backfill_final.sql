-- sql
-- Safe backfill: set orders.user_uid from orders.user_id without using the regex (~) on uuid typed columns.
-- Cast user_id to text and validate by length + presence of hyphens (works in Postgres).
BEGIN;
UPDATE public.orders
SET user_uid = user_id::uuid
WHERE user_uid IS NULL
  AND user_id IS NOT NULL
  AND length(user_id::text) = 36
  AND user_id::text LIKE '%-%';
COMMIT;

-- Verification (run after the above):
SELECT id, user_id, user_uid, created_at
FROM public.orders
WHERE user_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 50;