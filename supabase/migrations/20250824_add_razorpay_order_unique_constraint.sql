-- Add unique constraint on razorpay_order_id to prevent duplicate orders
-- This ensures that each Razorpay order can only have one corresponding record in our database

-- Step 1: Clean up existing duplicates by keeping only the most recent order for each razorpay_order_id
-- We'll use a CTE to identify duplicates and keep the one with the latest created_at timestamp

WITH duplicates AS (
  SELECT razorpay_order_id,
         COUNT(*) as count,
         MAX(created_at) as latest_created_at
  FROM orders
  WHERE razorpay_order_id IS NOT NULL
  GROUP BY razorpay_order_id
  HAVING COUNT(*) > 1
),
orders_to_delete AS (
  SELECT o.id
  FROM orders o
  JOIN duplicates d ON o.razorpay_order_id = d.razorpay_order_id
  WHERE o.created_at < d.latest_created_at
)
DELETE FROM orders
WHERE id IN (SELECT id FROM orders_to_delete);

-- Step 2: Add unique constraint on razorpay_order_id
ALTER TABLE orders
ADD CONSTRAINT orders_razorpay_order_id_unique
UNIQUE (razorpay_order_id);

-- Step 3: Constraint added successfully
-- This ensures each Razorpay order ID can only have one corresponding order record, preventing duplicates from webhook and API calls

-- Step 4: Verify the constraint was added and check for any remaining duplicates
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'orders'
AND constraint_name = 'orders_razorpay_order_id_unique';

-- Check for any remaining duplicates (should return no rows)
SELECT razorpay_order_id, COUNT(*)
FROM orders
WHERE razorpay_order_id IS NOT NULL
GROUP BY razorpay_order_id
HAVING COUNT(*) > 1;