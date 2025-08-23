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

    const admin = createAdminClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    try {
      const updates: any = {
        status: status === 'captured' || status === 'paid' || status === 'authorized' ? 'success' : status,
        razorpay_payment_id
      };
      if (amount !== null) updates.amount = amount;

      const { data, error } = await admin
        .from('orders')
        .update(updates)
        .eq('razorpay_order_id', razorpay_order_id)
        .select();

      const rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
      console.log('[webhook/razorpay] updated orders:', { rows: rowsCount, error: error || null });

      if (error) {
        console.error('[webhook/razorpay] update error', error);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
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