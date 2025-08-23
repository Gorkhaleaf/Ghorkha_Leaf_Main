import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = new Razorpay({ key_id, key_secret });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Dev helper: claim webhook-created orders for the currently authenticated user.
 * Client MUST call this endpoint with Authorization: Bearer <access_token>.
 *
 * Behavior:
 *  - Validates token via admin.auth.getUser(token) to obtain user.id and email.
 *  - Finds orders where user_uid IS NULL and razorpay_payment_id IS NOT NULL.
 *  - For each order, fetches Razorpay payment and, if payment.email or payment.contact
 *    matches the logged-in user's email or phone, updates that order.user_uid -> user.id.
 *
 * WARNING: This endpoint is intended for debugging / reconciliation only.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const admin = createAdminClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Lookup user from token
    let userId: string | null = null;
    let userEmail: string | null = null;
    try {
      const res: any = await admin.auth.getUser(token);
      const user = res?.data?.user ?? null;
      if (!user) {
        return NextResponse.json({ error: 'Invalid token or user not found' }, { status: 401 });
      }
      userId = user.id;
      userEmail = user.email ?? null;
    } catch (e) {
      console.warn('[debug/claim-orders] admin.auth.getUser failed', e);
      return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
    }

    // Find candidate orders (unclaimed, but have a payment id)
    const { data: candidates, error: selectErr } = await admin
      .from('orders')
      .select('*')
      .is('user_uid', null)
      .not('razorpay_payment_id', 'is', null);

    if (selectErr) {
      console.error('[debug/claim-orders] select error', selectErr);
      return NextResponse.json({ error: 'DB select failed', details: selectErr }, { status: 500 });
    }

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ success: true, message: 'No unclaimed orders with payment ids found', checked: 0 }, { status: 200 });
    }

    const updatedOrders: any[] = [];
    for (const o of candidates) {
      const paymentId = o.razorpay_payment_id;
      if (!paymentId) continue;
      try {
        const payment = await razorpay.payments.fetch(paymentId);
        const payEmail = (payment as any)?.email ?? (payment as any)?.contact_details?.email ?? null;
        const payContact = payment?.contact ?? null;

        // match by email (if available) or by contact/phone
        const emailMatch = userEmail && payEmail && userEmail.toLowerCase() === String(payEmail).toLowerCase();
        const contactMatch = (payContact && (String(payContact).replace(/\D/g, '') === String(o?.customer_phone ?? '').replace(/\D/g, ''))) || false;

        // Also allow match by userEmail vs payment.contact email if present
        if (emailMatch) {
          const { data: updated, error: updErr } = await admin
            .from('orders')
            .update({ user_uid: userId })
            .eq('id', o.id)
            .select();
          if (updErr) {
            console.warn('[debug/claim-orders] update error', updErr);
          } else {
            updatedOrders.push(...(Array.isArray(updated) ? updated : [updated]));
          }
        } else {
          // no match by email; skip
        }
      } catch (e) {
        console.warn('[debug/claim-orders] failed to fetch payment or process', paymentId, e);
        continue;
      }
    }

    return NextResponse.json({ success: true, checked: candidates.length, claimed: updatedOrders.length, orders: updatedOrders }, { status: 200 });
  } catch (e) {
    console.error('[debug/claim-orders] unexpected', e);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}