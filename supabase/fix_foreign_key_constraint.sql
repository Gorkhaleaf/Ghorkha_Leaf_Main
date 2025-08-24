-- Fix the foreign key constraint issue
-- Run this first if you're getting foreign key constraint errors

-- Remove the problematic foreign key constraint
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_customer_email_canonical_fkey;

-- Optional: Add a more lenient constraint (uncomment if you want linking)
-- ALTER TABLE public.orders
--   ADD CONSTRAINT orders_customer_email_canonical_fkey
--   FOREIGN KEY (customer_email_canonical)
--   REFERENCES public.profiles(email_canonical)
--   ON UPDATE CASCADE
--   ON DELETE SET NULL;