-- Add customer contact columns to orders table for phone-based order lookup
BEGIN;

-- Add customer email and phone columns to orders table
ALTER TABLE orders ADD COLUMN customer_email TEXT;
ALTER TABLE orders ADD COLUMN customer_phone TEXT;
ALTER TABLE orders ADD COLUMN customer_phone_normalized TEXT;

-- Create indexes for efficient lookups
CREATE INDEX idx_orders_customer_email ON orders (customer_email);
CREATE INDEX idx_orders_customer_phone_normalized ON orders (customer_phone_normalized);

-- Backfill normalized phone by stripping non-digits for existing rows
UPDATE orders
SET customer_phone_normalized = regexp_replace(customer_phone, '\D', '', 'g')
WHERE customer_phone IS NOT NULL AND (customer_phone_normalized IS NULL OR customer_phone_normalized = '');

COMMIT;

-- Verification:
-- SELECT id, customer_email, customer_phone, customer_phone_normalized FROM orders ORDER BY created_at DESC LIMIT 10;