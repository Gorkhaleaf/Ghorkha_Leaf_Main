# Clean Rebuild Instructions

## 🚨 IMPORTANT: This will DELETE all existing data!

This script will completely drop and recreate your `orders` and `profiles` tables. **All existing data will be lost!**

## 📋 Step-by-Step Instructions

### Step 1: Backup Your Data (Optional but Recommended)
```sql
-- Export your existing data if you want to keep it
SELECT * FROM public.orders;
SELECT * FROM public.profiles;
```

### Step 2: Run the Clean Rebuild Script

Go to your **Supabase Dashboard → SQL Editor** and run these commands **ONE BY ONE**:

#### A. Drop Existing Tables
```sql
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.profiles;
```

#### B. Drop Existing Functions
```sql
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_profile_email_canonical();
DROP FUNCTION IF EXISTS public.handle_order_customer_canonical();
```

#### C. Create Profiles Table
```sql
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
```

#### D. Enable Row Level Security
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### E. Create Orders Table
```sql
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

#### F. Add Foreign Key Constraint
```sql
ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_email_canonical_fkey
  FOREIGN KEY (customer_email_canonical)
  REFERENCES public.profiles(email_canonical)
  ON UPDATE CASCADE
  ON DELETE SET NULL;
```

#### G. Create Indexes
```sql
CREATE INDEX orders_user_uid_idx ON public.orders (user_uid);
CREATE INDEX orders_customer_email_canonical_idx ON public.orders (customer_email_canonical);
CREATE INDEX orders_customer_phone_normalized_idx ON public.orders (customer_phone_normalized);
CREATE INDEX orders_razorpay_order_id_idx ON public.orders (razorpay_order_id);
```

#### H. Create Trigger Functions
```sql
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
  IF NEW.email IS NOT NULL THEN
    NEW.email_canonical = lower(trim(NEW.email));
  END IF;

  IF NEW.phone IS NOT NULL THEN
    NEW.phone_normalized = regexp_replace(NEW.phone, '\D', '', 'g');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_order_customer_canonical()
RETURNS trigger AS $$
BEGIN
  IF NEW.customer_email IS NOT NULL THEN
    NEW.customer_email_canonical = lower(trim(NEW.customer_email));
  END IF;

  IF NEW.customer_phone IS NOT NULL THEN
    NEW.customer_phone_normalized = regexp_replace(NEW.customer_phone, '\D', '', 'g');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### I. Create Triggers
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_email_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_email_canonical();

CREATE TRIGGER on_order_customer_update
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_customer_canonical();
```

### Step 3: Verify the Setup

Run these verification queries:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'orders');

-- Check constraints
SELECT conname as constraint_name, conrelid::regclass as table_name
FROM pg_constraint
WHERE conrelid IN ('public.profiles'::regclass, 'public.orders'::regclass);

-- Check triggers
SELECT event_object_table, trigger_name
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('profiles', 'orders');
```

## 🎯 What This Fixes

✅ **Real Customer Data**: Orders now use actual customer information from profiles
✅ **Proper Data Linking**: Foreign key relationships ensure data integrity
✅ **Automatic Field Normalization**: Triggers handle email/phone canonicalization
✅ **Efficient Lookups**: Proper indexes for fast queries
✅ **Data Consistency**: Constraints prevent orphaned records

## 🚀 Next Steps

1. **Deploy Code Changes**: The updated application files are ready to deploy
2. **Test User Registration**: Create a test user and verify profile creation
3. **Test Checkout Flow**: Complete a test order to verify proper linking
4. **Monitor Webhooks**: Check that Razorpay webhooks properly link orders

## 📞 Support

If you encounter any issues:

1. Check the verification queries to identify problems
2. Review Supabase logs for error messages
3. Ensure all SQL commands were executed successfully
4. Test with a fresh user account

---

**⚠️ WARNING**: This process will permanently delete all existing order and profile data. Make sure you have backups if you need to preserve any data.