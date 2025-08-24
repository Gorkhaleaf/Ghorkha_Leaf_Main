-- Migration: Change orders linking from user_uid to email_canonical
-- This migration removes user_uid dependency and uses email_canonical for linking

-- Step 1: Remove user_uid from orders table (optional - can keep for legacy)
-- ALTER TABLE public.orders DROP COLUMN IF EXISTS user_uid;

-- Step 2: Ensure canonical columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_canonical text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_normalized text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email_canonical text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone_normalized text;

-- Step 3: Create indexes for email_canonical (run these separately if needed)
-- Note: CONCURRENTLY indexes cannot run in transaction blocks
-- Run these commands separately in SQL Editor if the migration fails:

-- CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_canonical_unique_idx
--   ON public.profiles (email_canonical)
--   WHERE email_canonical IS NOT NULL;

-- CREATE INDEX IF NOT EXISTS orders_customer_email_canonical_idx
--   ON public.orders (customer_email_canonical)
--   WHERE customer_email_canonical IS NOT NULL;

-- Step 4: Populate canonical email columns
UPDATE public.profiles
SET email_canonical = lower(trim(email))
WHERE email IS NOT NULL AND (email_canonical IS NULL OR email_canonical = '');

UPDATE public.orders
SET customer_email_canonical = lower(trim(customer_email))
WHERE customer_email IS NOT NULL AND (customer_email_canonical IS NULL OR customer_email_canonical = '');

-- Step 5: Add foreign key constraint from orders to profiles via email (optional)
-- Note: This constraint is optional and can be removed if it causes issues
-- ALTER TABLE public.orders
--   ADD CONSTRAINT orders_customer_email_canonical_fkey
--   FOREIGN KEY (customer_email_canonical)
--   REFERENCES public.profiles(email_canonical)
--   ON UPDATE CASCADE
--   ON DELETE SET NULL;

-- Step 6: Add triggers to automatically populate canonical fields
CREATE OR REPLACE FUNCTION public.handle_profile_email_canonical()
RETURNS trigger AS $$
BEGIN
  -- Set canonical email
  IF NEW.email IS NOT NULL THEN
    NEW.email_canonical = lower(trim(NEW.email));
  END IF;

  -- Set normalized phone
  IF NEW.phone IS NOT NULL THEN
    NEW.phone_normalized = regexp_replace(NEW.phone, '\D', '', 'g');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_order_customer_canonical()
RETURNS trigger AS $$
BEGIN
  -- Set canonical email
  IF NEW.customer_email IS NOT NULL THEN
    NEW.customer_email_canonical = lower(trim(NEW.customer_email));
  END IF;

  -- Set normalized phone
  IF NEW.customer_phone IS NOT NULL THEN
    NEW.customer_phone_normalized = regexp_replace(NEW.customer_phone, '\D', '', 'g');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_profile_email_update ON public.profiles;
CREATE TRIGGER on_profile_email_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_email_canonical();

DROP TRIGGER IF EXISTS on_order_customer_update ON public.orders;
CREATE TRIGGER on_order_customer_update
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_customer_canonical();

-- Step 7: Clear any existing user_uid values (optional)
-- UPDATE public.orders SET user_uid = NULL WHERE user_uid IS NOT NULL;

-- Verification queries
-- Check how many orders are now linked via email
SELECT
  COUNT(*) as total_orders,
  COUNT(customer_email_canonical) as email_linked_orders,
  COUNT(*) - COUNT(customer_email_canonical) as unlinked_orders
FROM public.orders;

-- Check for any constraint violations
SELECT COUNT(*) as constraint_violations
FROM public.orders o
LEFT JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
WHERE o.customer_email_canonical IS NOT NULL AND p.email_canonical IS NULL;

-- Show sample of email-linked orders
SELECT
  o.id as order_id,
  o.customer_email,
  o.customer_email_canonical,
  p.id as profile_id,
  p.email as profile_email
FROM public.orders o
LEFT JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
WHERE o.customer_email IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 10;