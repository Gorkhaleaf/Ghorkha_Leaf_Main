-- Create indexes separately (run after main migration)
-- These commands should be run separately in Supabase SQL Editor

-- Create unique index for profiles email_canonical
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_canonical_unique_idx
  ON public.profiles (email_canonical)
  WHERE email_canonical IS NOT NULL;

-- Create index for orders customer_email_canonical
CREATE INDEX IF NOT EXISTS orders_customer_email_canonical_idx
  ON public.orders (customer_email_canonical)
  WHERE customer_email_canonical IS NOT NULL;

-- Create index for orders customer_phone_normalized
CREATE INDEX IF NOT EXISTS orders_customer_phone_normalized_idx
  ON public.orders (customer_phone_normalized)
  WHERE customer_phone_normalized IS NOT NULL;