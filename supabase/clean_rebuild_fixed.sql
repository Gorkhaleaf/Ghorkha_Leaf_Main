-- 🚨 CLEAN REBUILD: FIXED VERSION (Handles dependencies)
-- This will DELETE ALL existing data and recreate tables from scratch
-- Run this in your Supabase SQL Editor

-- Step 1: Drop dependent objects first
DROP VIEW IF EXISTS user_orders CASCADE;

-- Step 2: Drop everything with CASCADE
DROP TRIGGER IF EXISTS on_profile_email_update ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_order_customer_update ON public.orders CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_profile_email_canonical() CASCADE;
DROP FUNCTION IF EXISTS public.handle_order_customer_canonical() CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 3: Create profiles table
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

-- Step 4: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Step 6: Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_id uuid,
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
  created_at timestamptz DEFAULT now()
);

-- Step 7: Foreign key constraint
ALTER TABLE public.orders ADD CONSTRAINT orders_customer_email_canonical_fkey FOREIGN KEY (customer_email_canonical) REFERENCES public.profiles(email_canonical) ON UPDATE CASCADE ON DELETE SET NULL;

-- Step 8: Indexes
CREATE INDEX orders_user_uid_idx ON public.orders (user_uid);
CREATE INDEX orders_customer_email_canonical_idx ON public.orders (customer_email_canonical);
CREATE INDEX orders_customer_phone_normalized_idx ON public.orders (customer_phone_normalized);
CREATE INDEX orders_razorpay_order_id_idx ON public.orders (razorpay_order_id);

-- Step 9: Functions
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, email_canonical)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, lower(trim(new.email)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_profile_email_canonical() RETURNS trigger AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN NEW.email_canonical = lower(trim(NEW.email)); END IF;
  IF NEW.phone IS NOT NULL THEN NEW.phone_normalized = regexp_replace(NEW.phone, '\D', '', 'g'); END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_order_customer_canonical() RETURNS trigger AS $$
BEGIN
  IF NEW.customer_email IS NOT NULL THEN NEW.customer_email_canonical = lower(trim(NEW.customer_email)); END IF;
  IF NEW.customer_phone IS NOT NULL THEN NEW.customer_phone_normalized = regexp_replace(NEW.customer_phone, '\D', '', 'g'); END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Triggers
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER on_profile_email_update BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_profile_email_canonical();
CREATE TRIGGER on_order_customer_update BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_order_customer_canonical();

-- Step 11: Verification
SELECT '✅ Clean rebuild completed successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'orders');