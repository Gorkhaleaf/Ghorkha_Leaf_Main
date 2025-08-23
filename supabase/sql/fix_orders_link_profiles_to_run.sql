-- sql
BEGIN;

-- normalize profiles.phone_normalized
UPDATE public.profiles
SET phone_normalized = regexp_replace(phone, '\D', '', 'g')
WHERE phone IS NOT NULL AND (phone_normalized IS NULL OR phone_normalized = '');

-- normalize orders.customer_phone_normalized
UPDATE public.orders
SET customer_phone_normalized = regexp_replace(customer_phone::text, '\D', '', 'g')
WHERE customer_phone IS NOT NULL AND (customer_phone_normalized IS NULL OR customer_phone_normalized = '');

-- backfill user_uid by email (case-insensitive)
UPDATE public.orders o
SET user_uid = p.id
FROM public.profiles p
WHERE o.user_uid IS NULL
  AND o.customer_email IS NOT NULL
  AND lower(trim(o.customer_email)) = lower(trim(p.email));

-- backfill user_uid by normalized phone
UPDATE public.orders o
SET user_uid = p.id
FROM public.profiles p
WHERE o.user_uid IS NULL
  AND o.customer_phone_normalized IS NOT NULL
  AND p.phone_normalized IS NOT NULL
  AND o.customer_phone_normalized = p.phone_normalized;

-- copy profile contact into linked orders when order has placeholder/missing data
UPDATE public.orders o
SET customer_email = p.email,
    customer_phone = COALESCE(NULLIF(o.customer_phone, ''), p.phone),
    customer_phone_normalized = COALESCE(NULLIF(o.customer_phone_normalized, ''), p.phone_normalized)
FROM public.profiles p
WHERE o.user_uid = p.id
  AND (
    o.customer_email IS NULL OR o.customer_email = '' OR o.customer_email = 'customer@example.com'
    OR o.customer_phone IS NULL OR o.customer_phone = '' OR o.customer_phone = '+919999999999' OR o.customer_phone_normalized = '919999999999'
  );

-- clear known placeholder email where no profile match exists
UPDATE public.orders
SET customer_email = NULL
WHERE customer_email = 'customer@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE lower(trim(p.email)) = lower(trim(public.orders.customer_email))
  );

-- safe backfill from user_id when it's a valid UUID-like string
-- Cast user_id to text before applying regex to avoid `uuid ~ unknown` operator error.
-- Use a conservative regex check on the text form.
UPDATE public.orders
SET user_uid = user_id::uuid
WHERE user_uid IS NULL
  AND user_id IS NOT NULL
  AND (user_id::text ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

COMMIT;

-- Verify the specific orders you listed:
SELECT id, user_id, amount, currency, items, razorpay_order_id, razorpay_payment_id, status, created_at, user_uid, customer_email, customer_phone, customer_phone_normalized
FROM public.orders
WHERE id IN (
  '08834eb8-7fb6-4189-ad38-39a341013a19',
  '0f46d585-c0f6-4f0d-a597-f85492f6776e'
)
ORDER BY created_at DESC;