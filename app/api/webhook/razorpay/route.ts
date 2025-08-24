import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    console.log('[webhook/razorpay] incoming signature:', signature ? `${signature.slice(0,8)}...` : null);

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.warn('[webhook/razorpay] missing RAZORPAY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      console.warn('[webhook/razorpay] missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expected = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      console.warn('[webhook/razorpay] signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(raw);
    console.log('[webhook/razorpay] verified event:', payload?.event);

    // Payload shapes vary by event. Common successful payment info is in payload.payment.entity
    const entity = payload?.payload?.payment?.entity || payload?.payload?.order?.entity || null;
    if (!entity) {
      console.warn('[webhook/razorpay] unexpected payload shape, ignoring');
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const razorpay_payment_id = entity.id || null;
    const razorpay_order_id = entity.order_id || entity.id || null; // payment.entity.order_id normally
    const status = entity.status || payload?.event;
    const amount = typeof entity.amount === 'number' ? entity.amount / 100 : null;

    // Log the incoming customer data from Razorpay
    console.log('[webhook/razorpay] Razorpay customer data:', {
      email: entity.email,
      contact: entity.contact,
      isSampleEmail: entity.email === 'customer@example.com',
      isSamplePhone: entity.contact === '+919999999999'
    });

    // Reject sample data from Razorpay test mode
    const isSampleData = entity.email === 'customer@example.com' ||
                        entity.contact === '+919999999999';

    if (isSampleData) {
      console.log('[webhook/razorpay] Detected sample data from Razorpay test mode, skipping customer data update');
      // Set these to null so they don't override real data
      entity.email = null;
      entity.contact = null;
    }

    const admin = createAdminClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    try {
       // Try to derive user from existing order data first
       let derivedUserId: string | null = null;
       const possibleEmail = entity.email || payload?.payload?.order?.entity?.email || payload?.payload?.customer?.email || null;
       const possibleContact = entity.contact || payload?.payload?.order?.entity?.contact || payload?.payload?.customer?.contact || null;
      // First, check if order exists and get current customer data
      const { data: existingOrder } = await admin
        .from('orders')
        .select('customer_email, customer_phone, user_uid')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      console.log('[webhook/razorpay] Existing order data:', {
        orderId: razorpay_order_id,
        existingEmail: existingOrder?.customer_email,
        existingPhone: existingOrder?.customer_phone,
        hasRealData: existingOrder?.customer_email && existingOrder?.customer_email !== 'customer@example.com'
      });

      const updates: any = {
        status: status === 'captured' || status === 'paid' || status === 'authorized' ? 'success' : status,
        razorpay_payment_id
      };
      if (amount !== null) updates.amount = amount;
      if (derivedUserId) updates.user_uid = derivedUserId;

      // Save customer contact info for phone-based lookups - only if not already set
      if (possibleEmail && (!existingOrder || !existingOrder.customer_email)) {
        updates.customer_email = possibleEmail;
      }
      if (possibleContact && (!existingOrder || !existingOrder.customer_phone)) {
        updates.customer_phone = possibleContact;
        updates.customer_phone_normalized = String(possibleContact).replace(/\D/g, '');
      }

      // First try to update existing order
      let { data, error } = await admin
        .from('orders')
        .update(updates)
        .eq('razorpay_order_id', razorpay_order_id)
        .select();

      let rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
      console.log('[webhook/razorpay] updated orders:', { rows: rowsCount, error: error || null });

      if (error) {
        console.error('[webhook/razorpay] update error', error);
        // If update failed due to constraint (e.g., NOT NULL on razorpay_payment_id), return error so migration can be applied.
        return NextResponse.json({ error: 'DB update failed', details: error }, { status: 500 });
      }

      // If no rows updated, the order might not exist yet - create it
      if (rowsCount === 0) {
        console.log('[webhook/razorpay] No existing order found, creating new order from webhook');

        // Create new order with available data
        const createPayload = {
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          status: status === 'captured' || status === 'paid' || status === 'authorized' ? 'success' : status,
          amount: amount,
          currency: 'INR', // Default currency
          items: [], // Will be populated by frontend if needed
          customer_email: entity.email || null,
          customer_phone: entity.contact || null,
          customer_email_canonical: entity.email || null,
          customer_phone_normalized: entity.contact ? String(entity.contact).replace(/\D/g, '') : null
        };

        const { data: newData, error: createError } = await admin
          .from('orders')
          .insert([createPayload])
          .select();

        if (createError) {
          console.error('[webhook/razorpay] create error', createError);
          return NextResponse.json({ error: 'DB create failed', details: createError }, { status: 500 });
        }

        data = newData;
        rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
        console.log('[webhook/razorpay] created new order:', { rows: rowsCount, created: data });
      }

      return NextResponse.json({ success: true, updated: rowsCount, orders: data }, { status: 200 });
    } catch (e) {
      console.error('[webhook/razorpay] processing failed', e);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  } catch (e) {
    console.error('[webhook/razorpay] unexpected error', e);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
