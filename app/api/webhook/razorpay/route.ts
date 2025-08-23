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

    // derive possible contact info
    const possibleEmail = entity.email || payload?.payload?.order?.entity?.email || payload?.payload?.customer?.email || null;
    const possibleContact = entity.contact || payload?.payload?.order?.entity?.contact || payload?.payload?.customer?.contact || null;

    // build updates
    const updatesBase: any = {
      status: status === 'captured' || status === 'paid' || status === 'authorized' ? 'success' : status,
      razorpay_payment_id
    };
    if (amount !== null) updatesBase.amount = amount;

    // try to derive user uid (reuse existing logic)
    let derivedUserId: string | null = null;
    try {
      if (possibleEmail) {
        try {
          if (typeof (admin.auth as any).getUserByEmail === 'function') {
            const res: any = await (admin.auth as any).getUserByEmail(possibleEmail);
            const user = res?.data?.user ?? res?.user ?? res;
            if (user?.id) derivedUserId = user.id;
          } else if (typeof (admin.auth as any).admin?.getUserByEmail === 'function') {
            const res: any = await (admin.auth as any).admin.getUserByEmail(possibleEmail);
            const user = res?.data?.user ?? res?.user ?? res;
            if (user?.id) derivedUserId = user.id;
          }
        } catch (e) {
          console.warn('[webhook/razorpay] email lookup on update failed', e);
        }
        if (!derivedUserId) {
          try {
            const { data: profile, error: profileErr } = await admin.from('profiles').select('id').eq('email', possibleEmail).maybeSingle();
            if (profile && (profile as any).id) {
              derivedUserId = (profile as any).id;
              console.log('[webhook/razorpay] derived user from profiles.email on update', derivedUserId);
            } else if (profileErr) {
              console.warn('[webhook/razorpay] profiles lookup error (email) on update', profileErr);
            }
          } catch (pfErr) {
            console.warn('[webhook/razorpay] profiles lookup exception (email) on update', pfErr);
          }
        }
      }
      if (!derivedUserId && possibleContact) {
        try {
          if (typeof (admin.auth as any).getUserByPhone === 'function') {
            const res: any = await (admin.auth as any).getUserByPhone(possibleContact);
            const user = res?.data?.user ?? res?.user ?? res;
            if (user?.id) derivedUserId = user.id;
          }
        } catch (e) {
          console.warn('[webhook/razorpay] phone auth lookup failed on update', e);
        }
        if (!derivedUserId) {
          try {
            const normalized = String(possibleContact).replace(/\D/g, '');
            const { data: profileByPhone, error: profilePhoneErr } = await admin.from('profiles').select('id').like('phone', `%${normalized}%`).maybeSingle();
            if (profileByPhone && (profileByPhone as any).id) {
              derivedUserId = (profileByPhone as any).id;
              console.log('[webhook/razorpay] derived user from profiles.phone on update', derivedUserId);
            } else if (profilePhoneErr) {
              console.warn('[webhook/razorpay] profiles phone lookup error (phone) on update', profilePhoneErr);
            }
          } catch (pfErr2) {
            console.warn('[webhook/razorpay] profiles phone lookup exception (phone) on update', pfErr2);
          }
        }
      }
    } catch (e) {
      console.warn('[webhook/razorpay] user derivation failed', e);
    }

    // prepare updates object
    const updates: any = { ...updatesBase };
    if (derivedUserId) updates.user_uid = derivedUserId;
    if (possibleEmail) {
      updates.customer_email = possibleEmail;
      try {
        // Test whether the canonical column exists (PostgREST schema/cache may lag)
        await admin.from('orders').select('customer_email_canonical').limit(1);
        updates.customer_email_canonical = String(possibleEmail).trim().toLowerCase();
      } catch (schemaErr) {
        console.warn('[webhook/razorpay] orders.customer_email_canonical not present, skipping canonical field', schemaErr);
      }
    }
    if (possibleContact) {
      updates.customer_phone = possibleContact;
      updates.customer_phone_normalized = String(possibleContact).replace(/\D/g, '');
    }

    // Attempt update; if schema/cache lacks canonical column (PGRST204), retry without it
    let updateResult: any = null;
    try {
      const res = await admin.from('orders').update(updates).eq('razorpay_order_id', razorpay_order_id).select();
      updateResult = res;
    } catch (e: any) {
      const msg = String(e || '');
      console.error('[webhook/razorpay] update exception', e);
      if (msg.includes('customer_email_canonical') || msg.includes("Could not find the 'customer_email_canonical' column") || String(e?.code) === 'PGRST204') {
        console.warn('[webhook/razorpay] schema missing customer_email_canonical, retrying update without it');
        delete updates.customer_email_canonical;
        try {
          const res2 = await admin.from('orders').update(updates).eq('razorpay_order_id', razorpay_order_id).select();
          updateResult = res2;
        } catch (e2) {
          console.error('[webhook/razorpay] update retry failed', e2);
          return NextResponse.json({ error: 'DB update failed (retry)', details: String(e2) }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: 'DB update failed', details: String(e) }, { status: 500 });
      }
    }

    const rowsCount = Array.isArray(updateResult?.data) ? updateResult.data.length : (updateResult?.data ? 1 : 0);
    console.log('[webhook/razorpay] updated orders:', { rows: rowsCount, error: updateResult?.error || null });

    if (updateResult?.error) {
      console.error('[webhook/razorpay] update error', updateResult.error);
      return NextResponse.json({ error: 'DB update failed', details: updateResult.error }, { status: 500 });
    }

    // If no rows updated, create provisional order, similarly retry without canonical if needed
    if (rowsCount === 0) {
      const insertPayload: any = {
        user_uid: derivedUserId,
        amount: amount ?? null,
        currency: (entity.currency || payload?.payload?.order?.entity?.currency) || null,
        items: [],
        razorpay_order_id,
        razorpay_payment_id,
        status: updatesBase.status || 'pending',
        customer_email: possibleEmail ?? null,
        customer_email_canonical: possibleEmail ? String(possibleEmail).trim().toLowerCase() : null
      };

      let insertResult: any = null;
      try {
        const resIns = await admin.from('orders').insert([insertPayload]).select();
        insertResult = resIns;
      } catch (ie: any) {
        const msg = String(ie || '');
        console.error('[webhook/razorpay] provisional insert exception (first attempt)', ie);
        if (msg.includes('customer_email_canonical') || msg.includes("Could not find the 'customer_email_canonical' column") || String(ie?.code) === 'PGRST204') {
          console.warn('[webhook/razorpay] schema missing customer_email_canonical, retrying provisional insert without it');
          delete insertPayload.customer_email_canonical;
          try {
            const resIns2 = await admin.from('orders').insert([insertPayload]).select();
            insertResult = resIns2;
          } catch (ie2) {
            console.error('[webhook/razorpay] provisional insert retry failed', ie2);
            return NextResponse.json({ error: 'Provisional insert failed', details: String(ie2) }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: 'Provisional insert failed', details: String(ie) }, { status: 500 });
        }
      }

      const insertedCount = Array.isArray(insertResult?.data) ? insertResult.data.length : (insertResult?.data ? 1 : 0);
      console.log('[webhook/razorpay] provisional order inserted by webhook:', { rows: insertedCount, error: insertResult?.error || null, derivedUserId });

      if (insertResult?.error) {
        console.error('[webhook/razorpay] provisional insert failed', insertResult.error);
        return NextResponse.json({ error: 'Provisional insert failed', details: insertResult.error }, { status: 500 });
      }

      return NextResponse.json({ success: true, created: insertedCount, orders: insertResult.data }, { status: 201 });
    }

    return NextResponse.json({ success: true, updated: rowsCount, orders: updateResult.data }, { status: 200 });
  } catch (e) {
    console.error('[webhook/razorpay] processing failed', e);
    return NextResponse.json({ error: 'Processing failed', details: String(e) }, { status: 500 });
  }
}