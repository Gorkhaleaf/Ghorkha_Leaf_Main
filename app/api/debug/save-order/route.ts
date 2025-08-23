import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function maskToken(token: string | null | undefined) {
  if (!token) return null;
  return `${String(token).slice(0,8)}...${String(token).slice(-4)}`;
}

function base64Decode(str: string) {
  try {
    if (typeof Buffer !== 'undefined' && Buffer.from) {
      return Buffer.from(str,'base64').toString('utf8');
    }
    if (typeof atob !== 'undefined') {
      return decodeURIComponent(Array.prototype.map.call(atob(str),(c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }
  } catch (e) {
    return null;
  }
  return null;
}

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = base64Decode(payload);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

async function validateTokenWithServiceRole(token: string | null) {
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn('[debug/save-order] missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
    return null;
  }
  try {
    const admin = createAdminClient(url, serviceKey);
    const res: any = await admin.auth.getUser(token);
    const user = res?.data?.user ?? null;
    if (user && user.id) return user.id;
    if (res?.error) {
      console.warn('[debug/save-order] getUser error', res.error);
    }
  } catch (e) {
    console.warn('[debug/save-order] unexpected error', e);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const bearer = authHeader.replace('Bearer ', '').trim();
    console.log('[debug/save-order] incoming headers:', { authorization: bearer ? maskToken(bearer) : null });

    const body = await req.json();
    console.log('[debug/save-order] incoming body (masked):', {
      user_id: body?.user_id,
      amount: body?.amount,
      itemsCount: Array.isArray(body?.items) ? body.items.length : undefined,
      razorpay_payment_id: !!body?.razorpay_payment_id
    });

    let userId = body?.user_id ?? null;
    if (!userId && bearer) {
      const svc = await validateTokenWithServiceRole(bearer);
      if (svc) userId = svc;
      else {
        const payload = decodeJwtPayload(bearer);
        if (payload && (payload.sub || payload.user_id)) userId = payload.sub || payload.user_id;
      }
    }

    if (!userId) {
      console.warn('[debug/save-order] missing user id and no valid bearer token');
      return NextResponse.json({ error: 'Missing user id or valid token' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createAdminClient(url, serviceKey);

    // Derive customer email from profiles when possible
    let customerEmail: string | null = null;
    let customerEmailCanonical: string | null = null;
    try {
      const { data: profileRow, error: profileErr } = await admin
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .maybeSingle();
      if (profileErr) console.warn('[debug/save-order] profile email lookup error', profileErr);
      customerEmail = profileRow?.email ?? body?.customer_email ?? null;
      customerEmailCanonical = customerEmail ? String(customerEmail).trim().toLowerCase() : null;
    } catch (e) {
      console.warn('[debug/save-order] profile lookup exception', e);
    }

    const insertBody = {
      user_id: userId,
      amount: body?.amount,
      currency: body?.currency ?? 'INR',
      items: body?.items ?? [],
      razorpay_order_id: body?.razorpay_order_id,
      razorpay_payment_id: body?.razorpay_payment_id,
      status: body?.status ?? 'success',
      customer_email: customerEmail,
      customer_email_canonical: customerEmailCanonical
    };

    try {
      const { data, error } = await admin.from('orders').insert([insertBody]).select();
      const rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
      console.log('[debug/save-order] insert result:', { rows: rowsCount, error: error || null });
      if (error) {
        const code = (error as any)?.code ?? null;
        if (String(error).toLowerCase().includes('foreign key') || code === '23503') {
          console.error('[debug/save-order] FK violation on insert', { userId, customerEmail, razorpay_order_id: insertBody.razorpay_order_id, dbError: error });
        }
        throw error;
      }
      return NextResponse.json({ success: true, inserted: rowsCount, order: data }, { status: 200 });
    } catch (e) {
      console.error('[debug/save-order] insert failed:', e);
      return NextResponse.json({ error: 'Insert failed', details: process.env.NODE_ENV === 'development' ? String(e) : undefined }, { status: 500 });
    }

  } catch (e) {
    console.error('[debug/save-order] unexpected error:', e);
    return NextResponse.json({ error: 'Bad request', details: process.env.NODE_ENV === 'development' ? String(e) : undefined }, { status: 400 });
  }
}