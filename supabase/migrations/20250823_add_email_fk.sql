-- Migration: add email fields, canonical columns, and FK from orders.customer_email_canonical -> profiles.email_canonical
-- Run on Postgres (psql) or Supabase SQL editor. Test on staging first.

-- Step A: add nullable columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_canonical text;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email_canonical text;

-- Step B: populate canonical email columns
UPDATE public.profiles
SET email_canonical = lower(trim(email))
WHERE email IS NOT NULL AND (email_canonical IS NULL OR email_canonical = '');

-- Backfill orders.customer_email/customer_email_canonical for rows with a user reference
UPDATE public.orders o
SET customer_email = p.email,
    customer_email_canonical = lower(trim(p.email))
FROM public.profiles p
WHERE (o.user_uid = p.id OR o.user_id = p.id)
  AND (o.customer_email IS NULL OR o.customer_email = '')
  AND p.email IS NOT NULL;

-- Step C: check duplicates before creating unique index
-- Run this and ensure no rows are returned
SELECT email_canonical, count(*) FROM public.profiles
WHERE email_canonical IS NOT NULL
GROUP BY 1 HAVING count(*) > 1;

-- If zero duplicates, create unique index concurrently (run outside transaction)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS profiles_email_canonical_unique_idx
  ON public.profiles (email_canonical)
  WHERE email_canonical IS NOT NULL;

-- Step D: add FK constraint in NOT VALID mode then validate
BEGIN;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_email_canonical_fkey
  FOREIGN KEY (customer_email_canonical)
  REFERENCES public.profiles(email_canonical)
  ON UPDATE CASCADE
  ON DELETE SET NULL
  NOT VALID;
COMMIT;

-- Validate the constraint (this will check existing rows)
ALTER TABLE public.orders VALIDATE CONSTRAINT orders_customer_email_canonical_fkey;

-- If validation fails, use this query to find offending rows:
SELECT o.id, o.customer_email, o.customer_email_canonical
FROM public.orders o
LEFT JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
WHERE o.customer_email_canonical IS NOT NULL AND p.email_canonical IS NULL
LIMIT 100;

-- Verification queries
SELECT count(*) FROM public.orders o
LEFT JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
WHERE o.customer_email_canonical IS NOT NULL AND p.email_canonical IS NULL;

SELECT o.id, o.customer_email, p.id as profile_id, p.email
FROM public.orders o
JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
LIMIT 20;

-- Notes:
-- * CREATE UNIQUE INDEX CONCURRENTLY must be run outside a transaction.
-- * VALIDATE CONSTRAINT may take time on large tables.
-- * Backup DB before running on production.