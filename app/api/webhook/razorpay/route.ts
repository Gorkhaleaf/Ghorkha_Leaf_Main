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
        // If update failed due to constraint (e.g., NOT NULL on razorpay_payment_id), return error so migration can be applied.
        return NextResponse.json({ error: 'DB update failed', details: error }, { status: 500 });
      }

      // If no rows updated, attempt to create a provisional order and try to associate with a user by email/contact
      if (rowsCount === 0) {
        try {
          // Attempt to derive a user from payload (common fields: entity.email, entity.contact, payload.customer, payload.payment.entity)
          let derivedUserId: string | null = null;
          const possibleEmail = entity.email || payload?.payload?.order?.entity?.email || payload?.payload?.customer?.email || null;
          const possibleContact = entity.contact || payload?.payload?.order?.entity?.contact || payload?.payload?.customer?.contact || null;

          if (possibleEmail) {
            try {
              // Try common supabase admin auth methods to lookup user by email.
              if (typeof (admin.auth as any).getUserByEmail === 'function') {
                const res: any = await (admin.auth as any).getUserByEmail(possibleEmail);
                const user = res?.data?.user ?? res?.user ?? res;
                if (user?.id) derivedUserId = user.id;
              } else if (typeof (admin.auth as any).admin?.getUserByEmail === 'function') {
                const res: any = await (admin.auth as any).admin.getUserByEmail(possibleEmail);
                const user = res?.data?.user ?? res?.user ?? res;
                if (user?.id) derivedUserId = user.id;
              } else {
                console.warn('[webhook/razorpay] admin.auth.getUserByEmail not available, skipping email lookup');
              }
            } catch (e) {
              console.warn('[webhook/razorpay] getUserByEmail failed', e);
            }
          }

          // Optionally try contact/phone lookup if email not found and method available
          if (!derivedUserId && possibleContact) {
            try {
              if (typeof (admin.auth as any).getUserByPhone === 'function') {
                const res: any = await (admin.auth as any).getUserByPhone(possibleContact);
                const user = res?.data?.user ?? res?.user ?? res;
                if (user?.id) derivedUserId = user.id;
              } else {
                // some Supabase stacks might not expose phone lookup; skip quietly
                console.warn('[webhook/razorpay] admin.auth.getUserByPhone not available, skipping phone lookup');
              }
            } catch (e) {
              console.warn('[webhook/razorpay] getUserByPhone failed', e);
            }
          }

          const insertPayload: any = {
            user_uid: derivedUserId,
            amount: amount ?? null,
            currency: (entity.currency || payload?.payload?.order?.entity?.currency) || null,
            items: [],
            razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
            status: updates.status || 'pending'
          };

          const { data: inserted, error: insertErr } = await admin.from('orders').insert([insertPayload]).select();
          const insertedCount = Array.isArray(inserted as any) ? (inserted as any).length : (inserted ? 1 : 0);
          console.log('[webhook/razorpay] provisional order inserted by webhook:', { rows: insertedCount, error: insertErr || null, derivedUserId });

          if (insertErr) {
            console.error('[webhook/razorpay] provisional insert failed', insertErr);
            return NextResponse.json({ error: 'Provisional insert failed', details: insertErr }, { status: 500 });
          }

          return NextResponse.json({ success: true, created: insertedCount, orders: inserted }, { status: 201 });
        } catch (e) {
          console.error('[webhook/razorpay] provisional insert exception', e);
          return NextResponse.json({ error: 'Provisional insert exception' }, { status: 500 });
        }
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