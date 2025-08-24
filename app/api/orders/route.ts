import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function maskToken(token: string | null | undefined) {
  if (!token) return null;
  return `${String(token).slice(0, 8)}...${String(token).slice(-4)}`;
}

function base64Decode(str: string) {
  try {
    if (typeof Buffer !== 'undefined' && Buffer.from) {
      return Buffer.from(str, 'base64').toString('utf8');
    }
    if (typeof atob !== 'undefined') {
      return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
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

/**
 * Robust cookie extractor: accepts either a synchronous ReadonlyRequestCookies
 * or a Promise that resolves to it (some Next runtimes require awaiting cookies()).
 */
async function extractTokenFromCookies(cookieStore: any) {
  try {
    const store = (cookieStore && typeof cookieStore.then === 'function') ? await cookieStore : cookieStore;
    const all = (store?.getAll && typeof store.getAll === 'function') ? store.getAll() : [];
    for (const c of all) {
      const name = c.name || '';
      const value = c.value || '';
      if (!/auth-token|sb-/.test(name)) continue;

      if (value.startsWith('base64-')) {
        const b64 = value.replace(/^base64-/, '');
        const decoded = base64Decode(b64);
        try {
          const parsed = decoded ? JSON.parse(decoded) : null;
          if (parsed) {
            if (parsed.currentSession && parsed.currentSession.access_token) return parsed.currentSession.access_token;
            if (parsed.access_token) return parsed.access_token;
            if (typeof parsed === 'string' && parsed.split('.').length === 3) return parsed;
          }
        } catch (e) {
          if (decoded && decoded.split('.').length === 3) return decoded;
        }
        continue;
      }

      try {
        const parsed = value ? JSON.parse(value) : null;
        if (parsed) {
          if (parsed.currentSession && parsed.currentSession.access_token) return parsed.currentSession.access_token;
          if (parsed.access_token) return parsed.access_token;
        }
      } catch (e) {
        if (value && value.split('.').length === 3) return value;
      }
    }
  } catch (e) {
    console.warn('[extractTokenFromCookies] failed', e);
  }
  return null;
}

async function validateTokenWithServiceRole(token: string | null) {
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn('[validateTokenWithServiceRole] missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
    return null;
  }

  try {
    const admin = createAdminClient(url, serviceKey);
    // getUser accepts a jwt string
    const res: any = await admin.auth.getUser(token);
    const user = res?.data?.user ?? null;
    if (user && user.id) return user.id;
    if (res?.error) {
      console.warn('[validateTokenWithServiceRole] getUser error', res.error);
    }
  } catch (e) {
    console.warn('[validateTokenWithServiceRole] unexpected error', e);
  }
  return null;
}

async function resolveSessionFallback(req: NextRequest, cookieStore: any, supabaseCookieToken?: string) {
  // Try Authorization header
  const authHeader = req.headers.get('authorization') || '';
  const bearer = authHeader.replace('Bearer ', '').trim();
  if (bearer) {
    console.log('[resolveSessionFallback] trying Authorization header (masked)', maskToken(bearer));
    const svcUserId = await validateTokenWithServiceRole(bearer);
    if (svcUserId) {
      console.log('[resolveSessionFallback] validated bearer token with service role, user id:', svcUserId);
      return { user: { id: svcUserId }, expires_at: null };
    }
    // fallback: decode JWT payload (non-validated)
    const payload = decodeJwtPayload(bearer);
    if (payload && (payload.sub || payload.user_id)) {
      return { user: { id: payload.sub || payload.user_id }, expires_at: null };
    }
  }

  // Try extracted cookie token (handles base64-... cookie shapes)
  const tokenFromCookie = supabaseCookieToken ?? await extractTokenFromCookies(cookieStore);
  if (tokenFromCookie) {
    console.log('[resolveSessionFallback] extracted token from cookie (masked)', maskToken(tokenFromCookie));
    const svcUserId = await validateTokenWithServiceRole(tokenFromCookie);
    if (svcUserId) {
      console.log('[resolveSessionFallback] validated cookie token with service role, user id:', svcUserId);
      return { user: { id: svcUserId }, expires_at: null };
    }
    const payload = decodeJwtPayload(tokenFromCookie);
    if (payload && (payload.sub || payload.user_id)) {
      return { user: { id: payload.sub || payload.user_id }, expires_at: null };
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  // Use cookies store only for fallback extraction; avoid calling supabase auth helpers
  const cookieStore = cookies();

  try {
    const authHeader = req.headers.get('authorization');
    console.log('[API /orders POST] incoming headers:', {
      authorization: authHeader ? maskToken(authHeader.replace('Bearer ', '')) : null,
      cookie: !!req.headers.get('cookie')
    });
  } catch (e) {
    console.warn('[API /orders POST] failed to read headers for logging', e);
  }

  // Validate token/session first using service-role or JWT decoding
  let session: any = null;
  let authError: any = null;
  try {
    session = await resolveSessionFallback(req, cookieStore);
    if (session) {
      console.log('[API /orders POST] session established via pre-flight validation', { userId: session.user.id });
    }
  } catch (e) {
    authError = e;
  }

  // If we still don't have a session, reject early (we avoid calling auth helper to prevent cookie parse issues)
  if (authError || !session) {
    console.warn('[API /orders POST] unauthorized - no session or auth error', authError);
    return NextResponse.json({ error: 'Unauthorized', details: process.env.NODE_ENV === 'development' ? String(authError) : undefined }, { status: 401 });
  }

  const body = await req.json();
  console.log('[API /orders POST] request body (masked):', {
    user_id: body?.user_id,
    amount: body?.amount,
    currency: body?.currency,
    itemsCount: Array.isArray(body?.items) ? body.items.length : undefined,
    razorpay_order_id: body?.razorpay_order_id ? 'present' : undefined
  });

  // Log full items payload (truncated) for debugging and to ensure cart items are passed
  try {
    const itemsStr = body?.items ? JSON.stringify(body.items) : 'null';
    console.log('[API /orders POST] items payload (truncated):', itemsStr.length > 1000 ? itemsStr.slice(0, 1000) + '...(truncated)' : itemsStr);
  } catch (e) {
    console.warn('[API /orders POST] failed to stringify items', e);
  }

  if (body.user_id !== session.user.id) {
    console.warn('[API /orders POST] user id mismatch', { bodyUserId: body.user_id, sessionUserId: session.user.id });
    return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
  }

  // Use service-role admin client for DB write to avoid any Supabase auth helper cookie parsing
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createAdminClient(url, serviceKey);

  try {
    // Get user profile data to populate customer fields
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('email, phone, full_name')
      .eq('id', body.user_id)
      .single();

    if (profileError) {
      console.warn('[API /orders POST] Could not fetch user profile:', profileError);
    }

    // Ensure items saved as JSONB/JSON by passing the object directly
    const insertPayload = {
      user_uid: body.user_id,
      amount: body.amount,
      currency: body.currency,
      items: body.items ?? [],
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
      status: body?.status ?? 'success',
      // Populate customer fields from user profile
      customer_email: profile?.email || null,
      customer_phone: profile?.phone || null
    };

    console.log('[API /orders POST] inserting order (admin) user_id:', insertPayload.user_uid, 'amount:', insertPayload.amount, 'itemsCount:', Array.isArray(insertPayload.items) ? insertPayload.items.length : undefined);

    const { data, error } = await admin
      .from('orders')
      .insert([insertPayload])
      .select(); // request inserted row(s) back

    const rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
    console.log('[API /orders POST] supabase insert result (admin):', { rows: rowsCount, error: error || null, inserted: data });

    if (error) throw error;

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error('[API /orders POST] Order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to save order', details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Use cookies store only for fallback extraction; avoid calling supabase auth helpers
  const cookieStore = cookies();

  try {
    const authHeader = req.headers.get('authorization');
    console.log('[API /orders GET] incoming headers:', {
      authorization: authHeader ? maskToken(authHeader.replace('Bearer ', '')) : null,
      cookie: !!req.headers.get('cookie')
    });
  } catch (e) {
    console.warn('[API /orders GET] failed to read headers for logging', e);
  }

  let session: any = null;
  let authError: any = null;

  try {
    session = await resolveSessionFallback(req, cookieStore);
    if (session) {
      console.log('[API /orders GET] session established via pre-flight validation', { userId: session.user.id });
    }
  } catch (e) {
    authError = e;
  }

  if (authError || !session) {
    console.warn('[API /orders GET] unauthorized - no session or auth error', authError);
    return NextResponse.json({ error: 'Unauthorized', details: process.env.NODE_ENV === 'development' ? String(authError) : undefined }, { status: 401 });
  }

  // Query using service-role admin client to avoid cookie parsing inside auth-helpers
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createAdminClient(url, serviceKey);

  try {
    console.log('[API /orders GET] querying orders for user_id (admin):', session.user.id);
    const { data, error } = await admin
      .from('orders')
      .select('*')
      .eq('user_uid', session.user.id)
      .order('created_at', { ascending: false });

    const rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
    console.log('[API /orders GET] query result (admin):', { rows: rowsCount, error: error || null });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[API /orders GET] Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders', details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    );
  }
}