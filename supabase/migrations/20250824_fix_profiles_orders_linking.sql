-- Migration: Fix profiles and orders table linking
-- This migration addresses the issue where orders are not properly linked to user profiles

-- Step 1: Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_canonical text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_normalized text;

-- Step 2: Create unique indexes for email and phone lookups
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS profiles_email_canonical_unique_idx
  ON public.profiles (email_canonical)
  WHERE email_canonical IS NOT NULL;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS profiles_phone_normalized_unique_idx
  ON public.profiles (phone_normalized)
  WHERE phone_normalized IS NOT NULL;

-- Step 3: Add foreign key constraints to orders table
-- First, ensure the canonical columns exist in orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email_canonical text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone_normalized text;

-- Add foreign key from orders to profiles via email
ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_email_canonical_fkey
  FOREIGN KEY (customer_email_canonical)
  REFERENCES public.profiles(email_canonical)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

-- Step 4: Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS orders_customer_email_canonical_idx
  ON public.orders (customer_email_canonical)
  WHERE customer_email_canonical IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS orders_customer_phone_normalized_idx
  ON public.orders (customer_phone_normalized)
  WHERE customer_phone_normalized IS NOT NULL;

-- Step 5: Populate canonical email columns
UPDATE public.profiles
SET email_canonical = lower(trim(email))
WHERE email IS NOT NULL AND (email_canonical IS NULL OR email_canonical = '');

UPDATE public.orders
SET customer_email_canonical = lower(trim(customer_email))
WHERE customer_email IS NOT NULL AND (customer_email_canonical IS NULL OR customer_email_canonical = '');

-- Step 6: Populate phone normalized columns
UPDATE public.profiles
SET phone_normalized = regexp_replace(phone, '\D', '', 'g')
WHERE phone IS NOT NULL AND (phone_normalized IS NULL OR phone_normalized = '');

UPDATE public.orders
SET customer_phone_normalized = regexp_replace(customer_phone, '\D', '', 'g')
WHERE customer_phone IS NOT NULL AND (customer_phone_normalized IS NULL OR customer_phone_normalized = '');

-- Step 7: Link existing orders to profiles based on email
UPDATE public.orders o
SET user_uid = p.id
FROM public.profiles p
WHERE lower(trim(o.customer_email)) = p.email_canonical
  AND o.user_uid IS NULL
  AND o.customer_email IS NOT NULL
  AND p.email_canonical IS NOT NULL;

-- Step 8: Add trigger to automatically populate canonical fields
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

-- Create trigger for profiles table
DROP TRIGGER IF EXISTS on_profile_email_update ON public.profiles;
CREATE TRIGGER on_profile_email_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_email_canonical();

-- Step 9: Add trigger to automatically populate canonical fields in orders
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

-- Create trigger for orders table
DROP TRIGGER IF EXISTS on_order_customer_update ON public.orders;
CREATE TRIGGER on_order_customer_update
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_customer_canonical();

-- Step 10: Enable RLS policies for the new columns
-- Note: You may need to update RLS policies to allow access to email/phone fields

-- Verification queries
-- Check how many orders are now linked to profiles
SELECT
  COUNT(*) as total_orders,
  COUNT(user_uid) as linked_orders,
  COUNT(*) - COUNT(user_uid) as unlinked_orders
FROM public.orders;

-- Check for any constraint violations
SELECT COUNT(*) as constraint_violations
FROM public.orders o
LEFT JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
WHERE o.customer_email_canonical IS NOT NULL AND p.email_canonical IS NULL;

-- Show sample of linked orders
SELECT
  o.id as order_id,
  o.customer_email,
  p.id as profile_id,
  p.email as profile_email
FROM public.orders o
JOIN public.profiles p ON o.customer_email_canonical = p.email_canonical
LIMIT 10;