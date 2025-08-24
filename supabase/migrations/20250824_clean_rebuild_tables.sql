-- Clean rebuild of orders and profiles tables
-- This script drops existing tables and recreates them with proper linking

-- Step 1: Drop existing tables and related objects (if they exist)
DROP TRIGGER IF EXISTS on_profile_email_update ON public.profiles;
DROP TRIGGER IF EXISTS on_order_customer_update ON public.orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_profile_email_canonical();
DROP FUNCTION IF EXISTS public.handle_order_customer_canonical();

DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.profiles;

-- Step 2: Recreate profiles table with all necessary fields
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL,
  updated_at timestamp with time zone,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  email text,
  email_canonical text,
  phone text,
  phone_normalized text,

  PRIMARY KEY (id),
  UNIQUE(username),
  UNIQUE(email_canonical),
  UNIQUE(phone_normalized),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Step 3: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Step 5: Create orders table with proper linking
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_id uuid, -- Legacy field, can be removed later
  amount numeric(12,2),
  currency text DEFAULT 'INR',
  items jsonb DEFAULT '[]'::jsonb,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text DEFAULT 'pending',
  customer_email text,
  customer_email_canonical text,
  customer_phone text,
  customer_phone_normalized text,
  created_at timestamptz DEFAULT now(),

  -- Foreign key constraint to profiles
  CONSTRAINT orders_customer_email_canonical_fkey
    FOREIGN KEY (customer_email_canonical)
    REFERENCES public.profiles(email_canonical)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

-- Step 6: Create indexes for performance
CREATE INDEX orders_user_uid_idx ON public.orders (user_uid);
CREATE INDEX orders_customer_email_canonical_idx ON public.orders (customer_email_canonical);
CREATE INDEX orders_customer_phone_normalized_idx ON public.orders (customer_phone_normalized);
CREATE INDEX orders_razorpay_order_id_idx ON public.orders (razorpay_order_id);

-- Step 7: Create trigger functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, email_canonical)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    lower(trim(new.email))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Step 8: Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_email_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_email_canonical();

CREATE TRIGGER on_order_customer_update
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_customer_canonical();

-- Step 9: Enable RLS on orders (optional, depending on your security requirements)
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies for orders (if RLS is enabled)
-- CREATE POLICY "Users can view their own orders."
--   ON public.orders FOR SELECT
--   USING (auth.uid() = user_uid);

-- CREATE POLICY "Users can insert their own orders."
--   ON public.orders FOR INSERT
--   WITH CHECK (auth.uid() = user_uid);

-- Step 11: Verification queries
-- Uncomment and run these after executing the migration

/*
-- Check table structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'orders')
ORDER BY table_name, ordinal_position;

-- Check constraints
SELECT conname, conrelid::regclass, confrelid::regclass, conkey, confkey
FROM pg_constraint
WHERE conrelid IN ('public.profiles'::regclass, 'public.orders'::regclass);

-- Check triggers
SELECT event_object_table, trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('profiles', 'orders');

-- Check indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'orders');
*/

-- Migration completed successfully
SELECT 'Migration completed: Tables recreated with proper linking' as status;