# Manual Fix Steps for Dependency Error

## Problem
You're getting this error:
```
ERROR: 2BP01: cannot drop table orders because other objects depend on it
DETAIL: view user_orders depends on table orders
```

## Solution: Manual Step-by-Step Fix

### Step 1: Drop the Dependent View First
```sql
-- Drop the view that depends on orders table
DROP VIEW IF EXISTS user_orders;
```

### Step 2: Now Drop the Tables
```sql
-- Drop the tables (now they have no dependencies)
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.profiles;
```

### Step 3: Drop Functions and Triggers
```sql
-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_profile_email_canonical();
DROP FUNCTION IF EXISTS public.handle_order_customer_canonical();

-- Drop triggers
DROP TRIGGER IF EXISTS on_profile_email_update ON public.profiles;
DROP TRIGGER IF EXISTS on_order_customer_update ON public.orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

### Step 4: Create New Tables
```sql
-- Create profiles table
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

### Step 5: Create Orders Table
```sql
-- Create orders table
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
```

### Step 6: Add Foreign Key and Indexes
```sql
-- Foreign key constraint
ALTER TABLE public.orders ADD CONSTRAINT orders_customer_email_canonical_fkey FOREIGN KEY (customer_email_canonical) REFERENCES public.profiles(email_canonical) ON UPDATE CASCADE ON DELETE SET NULL;

-- Indexes
CREATE INDEX orders_user_uid_idx ON public.orders (user_uid);
CREATE INDEX orders_customer_email_canonical_idx ON public.orders (customer_email_canonical);
CREATE INDEX orders_customer_phone_normalized_idx ON public.orders (customer_phone_normalized);
CREATE INDEX orders_razorpay_order_id_idx ON public.orders (razorpay_order_id);
```

### Step 7: Create Functions
```sql
-- Function for new user
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, email_canonical)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, lower(trim(new.email)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for profile canonical fields
CREATE OR REPLACE FUNCTION public.handle_profile_email_canonical() RETURNS trigger AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN NEW.email_canonical = lower(trim(NEW.email)); END IF;
  IF NEW.phone IS NOT NULL THEN NEW.phone_normalized = regexp_replace(NEW.phone, '\D', '', 'g'); END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for order canonical fields
CREATE OR REPLACE FUNCTION public.handle_order_customer_canonical() RETURNS trigger AS $$
BEGIN
  IF NEW.customer_email IS NOT NULL THEN NEW.customer_email_canonical = lower(trim(NEW.customer_email)); END IF;
  IF NEW.customer_phone IS NOT NULL THEN NEW.customer_phone_normalized = regexp_replace(NEW.customer_phone, '\D', '', 'g'); END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 8: Create Triggers
```sql
-- Triggers
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER on_profile_email_update BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_profile_email_canonical();
CREATE TRIGGER on_order_customer_update BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_order_customer_canonical();
```

### Step 9: Verify
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'orders');

-- Check constraints
SELECT conname as constraint_name, conrelid::regclass as table_name FROM pg_constraint WHERE conrelid IN ('public.profiles'::regclass, 'public.orders'::regclass);
```

## Alternative: Use CASCADE (If You Want to Delete Everything)

If you want to delete everything including dependent objects automatically:

```sql
-- This will delete the orders table AND any views that depend on it
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

## After Running the Fix

1. **Deploy the code changes** (the updated files are ready)
2. **Test user registration** - profiles should be created automatically
3. **Test checkout flow** - should use real customer data
4. **Verify webhooks** - orders should link properly to profiles

## Need Help?

If you still get errors:
1. Check what other objects depend on the tables
2. Drop them manually first
3. Or use the CASCADE option

The key is to drop dependent objects (like views) before dropping the main tables.