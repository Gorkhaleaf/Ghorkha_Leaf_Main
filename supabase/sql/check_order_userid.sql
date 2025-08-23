-- Run this in Supabase SQL editor to find the order and its user_id (replace id if needed)
SELECT id, user_id, amount, currency, items, razorpay_order_id, razorpay_payment_id, status, created_at
FROM public.orders
WHERE razorpay_order_id = 'order_R8iFMdG95NW6La';