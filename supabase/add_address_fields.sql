-- Add address fields to profiles table (only add columns that don't exist)
-- Note: Run these commands one by one in Supabase SQL Editor if needed

-- Check if phone column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone text;
    END IF;
END $$;

-- Check if phone_normalized column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'phone_normalized') THEN
        ALTER TABLE profiles ADD COLUMN phone_normalized text;
    END IF;
END $$;

-- Check if address_line_1 column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'address_line_1') THEN
        ALTER TABLE profiles ADD COLUMN address_line_1 text;
    END IF;
END $$;

-- Check if address_line_2 column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'address_line_2') THEN
        ALTER TABLE profiles ADD COLUMN address_line_2 text;
    END IF;
END $$;

-- Check if city column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'city') THEN
        ALTER TABLE profiles ADD COLUMN city text;
    END IF;
END $$;

-- Check if state column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'state') THEN
        ALTER TABLE profiles ADD COLUMN state text;
    END IF;
END $$;

-- Check if pincode column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'pincode') THEN
        ALTER TABLE profiles ADD COLUMN pincode text;
    END IF;
END $$;

-- Check if country column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'country') THEN
        ALTER TABLE profiles ADD COLUMN country text DEFAULT 'India';
    END IF;
END $$;

-- Create index for phone_normalized if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_phone_normalized ON profiles(phone_normalized);

-- Add razorpay_order_id_original column to orders table for storing original order IDs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'orders' AND column_name = 'razorpay_order_id_original') THEN
        ALTER TABLE orders ADD COLUMN razorpay_order_id_original text;
    END IF;
END $$;