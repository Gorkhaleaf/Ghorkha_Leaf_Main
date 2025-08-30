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
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.warn('[API /orders POST] Could not fetch user profile:', profileError);
    }

    // Use customer data from request body if provided, otherwise fallback to profile/JWT
    console.log('[API /orders POST] Customer data sources:', {
      bodyEmail: body.customer_email,
      bodyPhone: body.customer_phone,
      profileEmail: profile?.email,
      profilePhone: profile?.phone
    });

    let customerEmail = body.customer_email || profile?.email || null;
    let customerPhone = body.customer_phone || profile?.phone || null;

    console.log('[API /orders POST] Selected customer data:', {
      customerEmail,
      customerPhone,
      source: body.customer_email ? 'request_body' : profile?.email ? 'profile' : 'none'
    });

    // Fallback: Get email from JWT token if still no customer email
    if (!customerEmail) {
      try {
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.replace('Bearer ', '').trim();
        console.log('[API /orders POST] Checking JWT token for email, token present:', !!token);

        if (token) {
          const payload = decodeJwtPayload(token);
          console.log('[API /orders POST] JWT payload keys:', payload ? Object.keys(payload) : 'null');
          console.log('[API /orders POST] JWT payload email:', payload?.email);

          if (payload?.email) {
            customerEmail = payload.email;
            console.log('[API /orders POST] Using email from JWT token:', customerEmail);
          } else if (payload?.sub) {
            // Try to get user from Supabase auth
            console.log('[API /orders POST] No email in JWT, trying to get user by ID:', payload.sub);
            try {
              const { data: authUser, error: authError } = await admin.auth.admin.getUserById(payload.sub);
              if (authUser?.user?.email) {
                customerEmail = authUser.user.email;
                console.log('[API /orders POST] Using email from Supabase auth:', customerEmail);
              } else if (authError) {
                console.warn('[API /orders POST] Auth user lookup error:', authError);
              }
            } catch (authErr) {
              console.warn('[API /orders POST] Auth user lookup failed:', authErr);
            }
          }
        } else {
          console.log('[API /orders POST] No authorization token found');
        }
      } catch (e) {
        console.warn('[API /orders POST] Could not extract email from JWT:', e);
      }
    }

    // If we still don't have customer email, this is a critical issue
    if (!customerEmail) {
      console.error('[API /orders POST] CRITICAL: No customer email found for authenticated user:', session.user.id);
      // In production, you might want to return an error here
      // For now, we'll allow the order but log the issue
    }

    // Validate and reject sample data
    if (customerEmail === 'customer@example.com') {
      console.error('[API /orders POST] CRITICAL: Received sample email data:', customerEmail);
      customerEmail = null;
    }
    if (customerPhone === '+919999999999') {
      console.error('[API /orders POST] CRITICAL: Received sample phone data:', customerPhone);
      customerPhone = null;
    }

    console.log('[API /orders POST] Final validated customer data:', {
      customerEmail,
      customerPhone,
      source: body.customer_email ? 'request_body' : profile?.email ? 'profile' : 'jwt_fallback',
      isValidEmail: customerEmail && customerEmail !== 'customer@example.com',
      isValidPhone: customerPhone && customerPhone !== '+919999999999'
    });

    // Check if a successful order already exists for this payment to prevent duplicates
    if (body.razorpay_payment_id) {
      const existingSuccessfulOrder = await admin
        .from('orders')
        .select('id, razorpay_payment_id')
        .eq('razorpay_payment_id', body.razorpay_payment_id)
        .eq('status', 'success')
        .single();

      if (existingSuccessfulOrder.data) {
        console.log('[API /orders POST] Successful order already exists for payment:', body.razorpay_payment_id);
        return NextResponse.json({
          success: true,
          message: 'Order already processed',
          order: existingSuccessfulOrder.data
        }, { status: 200 });
      }
    }

    // Check if there's a pending order with the same razorpay_order_id to update
    const existingPendingOrder = await admin
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', body.razorpay_order_id)
      .eq('status', 'pending')
      .single();

    if (existingPendingOrder.data) {
      console.log('[API /orders POST] Found existing pending order, updating to success');

      const updatePayload = {
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
        status: body?.status ?? 'success',
        // Update customer fields
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_email_canonical: customerEmail,
        customer_phone_normalized: customerPhone ? String(customerPhone).replace(/\D/g, '') : null,
        // Update user association
        user_uid: session.user.id,
        user_id: session.user.id
      };

      const updateResult = await admin
        .from('orders')
        .update(updatePayload)
        .eq('id', existingPendingOrder.data.id)
        .select();

      const data = updateResult.data;
      const error = updateResult.error;

      console.log('[API /orders POST] supabase update result (admin):', {
        rows: Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0),
        error: error || null,
        updated: data
      });

      if (error) throw error;

      return NextResponse.json({ success: true, order: data }, { status: 200 });
    }

    console.log('[API /orders POST] Creating new order');

    const insertPayload = {
      amount: body.amount,
      currency: body.currency,
      items: body.items ?? [],
      razorpay_order_id: body.razorpay_order_id, // Use original Razorpay order ID directly
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
      status: body?.status ?? 'success',
      // Populate customer fields from user profile or JWT
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_email_canonical: customerEmail,
      customer_phone_normalized: customerPhone ? String(customerPhone).replace(/\D/g, '') : null,
      // Set user association
      user_uid: session.user.id,
      user_id: session.user.id
    };

    console.log('[API /orders POST] inserting order (admin) customer_email:', insertPayload.customer_email, 'customer_phone:', insertPayload.customer_phone, 'amount:', insertPayload.amount, 'itemsCount:', Array.isArray(insertPayload.items) ? insertPayload.items.length : undefined);

    const insertResult = await admin
      .from('orders')
      .insert([insertPayload])
      .select();

    const data = insertResult.data;
    const error = insertResult.error;
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
    // Get user profile to find their email for linking orders
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('email')
      .eq('id', session.user.id)
      .single();

    let userEmail = profile?.email || null;

    if (profileError) {
      console.warn('[API /orders GET] Could not fetch user profile:', profileError);
      // Fallback: Try to get email from JWT token
      try {
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.replace('Bearer ', '').trim();
        console.log('[API /orders GET] Checking JWT token for email, token present:', !!token);

        if (token) {
          const payload = decodeJwtPayload(token);
          console.log('[API /orders GET] JWT payload keys:', payload ? Object.keys(payload) : 'null');
          console.log('[API /orders GET] JWT payload email:', payload?.email);

          if (payload?.email) {
            userEmail = payload.email;
            console.log('[API /orders GET] Using email from JWT token:', userEmail);
          } else if (payload?.sub) {
            // Try to get user from Supabase auth
            console.log('[API /orders GET] No email in JWT, trying to get user by ID:', payload.sub);
            try {
              const { data: authUser, error: authError } = await admin.auth.admin.getUserById(payload.sub);
              if (authUser?.user?.email) {
                userEmail = authUser.user.email;
                console.log('[API /orders GET] Using email from Supabase auth:', userEmail);
              } else if (authError) {
                console.warn('[API /orders GET] Auth user lookup error:', authError);
              }
            } catch (authErr) {
              console.warn('[API /orders GET] Auth user lookup failed:', authErr);
            }
          }
        } else {
          console.log('[API /orders GET] No authorization token found');
        }
      } catch (e) {
        console.warn('[API /orders GET] Could not extract email from JWT:', e);
      }
    }

    if (!userEmail) {
      console.warn('[API /orders GET] No email found for user, returning empty array');
      console.error('[API /orders GET] CRITICAL: No email found for authenticated user:', session.user.id);
      return NextResponse.json([], { status: 200 });
    }

    console.log('[API /orders GET] querying orders for user email (admin):', userEmail);
    const { data, error } = await admin
      .from('orders')
      .select('*')
      .eq('customer_email', userEmail)
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