CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount NUMERIC NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  items JSONB NOT NULL,
  razorpay_order_id VARCHAR(255) NOT NULL,
  razorpay_payment_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW user_orders AS
SELECT id, amount, currency, items, status, created_at
FROM orders
WHERE user_id = auth.uid();