-- Remove the foreign key constraint that's causing webhook failures
-- This allows orders to exist even if there's no matching profile

-- Drop the foreign key constraint if it exists
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_customer_email_canonical_fkey;

-- Optional: Add a more lenient constraint (uncomment if needed)
-- ALTER TABLE public.orders
--   ADD CONSTRAINT orders_customer_email_canonical_fkey
--   FOREIGN KEY (customer_email_canonical)
--   REFERENCES public.profiles(email_canonical)
--   ON UPDATE CASCADE
--   ON DELETE SET NULL;