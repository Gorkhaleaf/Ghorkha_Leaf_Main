import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

// Log credential status (mask the secret)
console.log('[API /razorpay] Credentials loaded:', {
  key_id_present: !!key_id,
  key_id_value: key_id ? `${key_id.substring(0, 8)}...` : 'MISSING',
  key_secret_present: !!key_secret,
  key_secret_length: key_secret ? key_secret.length : 0
});

// Validate credentials are loaded
if (!key_id || !key_secret) {
  console.error('[API /razorpay] CRITICAL: Missing Razorpay credentials!', {
    key_id: !!key_id,
    key_secret: !!key_secret
  });
}

const razorpay = new Razorpay({
  key_id: key_id!,
  key_secret: key_secret!,
});

export async function POST(req: NextRequest) {
  const { amount, currency = 'INR', items = null, user_id = null } = await req.json();

  console.log('[API /razorpay POST] Received request:', {
    amount,
    currency,
    itemCount: items ? items.length : 0,
    user_id: user_id ? 'provided' : 'null'
  });

  // Validate amount
  if (!amount || amount < 1) {
    console.error('[API /razorpay POST] Invalid amount:', amount);
    return NextResponse.json(
      { error: 'Invalid amount. Must be at least ₹1' },
      { status: 400 }
    );
  }

  // Convert rupees to paise (Razorpay expects amount in smallest currency unit)
  const amountInPaise = Math.round(amount * 100);

  console.log('[API /razorpay POST] Amount conversion:', {
    amountInRupees: amount,
    amountInPaise: amountInPaise
  });

  const options = {
    amount: amountInPaise, // amount in paise (smallest currency unit)
    currency,
    receipt: `receipt_order_${randomBytes(4).toString('hex')}`,
    notes: items ? { items: JSON.stringify(items) } : undefined
  };

  try {
    console.log('[API /razorpay POST] Creating Razorpay order with options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt
    });

    const order = await razorpay.orders.create(options);

    console.log('[API /razorpay POST] Razorpay order created successfully:', {
      id: (order as any).id,
      amount: (order as any).amount,
      currency: (order as any).currency,
      status: (order as any).status
    });

    // Create admin client for potential provisional DB insert and token validation
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createAdminClient(url, serviceKey);

    // Derive user_id from Authorization Bearer token when possible (safer than trusting client)
    const authHeader = req.headers.get('authorization') || '';
    let derivedUserId = user_id;

    if (!derivedUserId && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const { data: userData, error: userErr } = await admin.auth.getUser(token);
        if (userData && (userData as any).user && (userData as any).user.id) {
          derivedUserId = (userData as any).user.id;
        } else if (userErr) {
          console.warn('[API /razorpay POST] auth.getUser returned error', userErr);
        }
      } catch (err) {
        console.warn('[API /razorpay POST] failed to derive user from token', err);
      }
    }

    // Always attempt to create a provisional pending order so webhook can reconcile
    try {
      const insertPayload: any = {
        user_uid: derivedUserId,
        amount: amount,
        currency,
        items: items ?? [],
        razorpay_order_id: (order as any).id, // Use original Razorpay order ID directly
        status: 'pending'
      };

      const { data, error } = await admin.from('orders').insert([insertPayload]).select();
      const rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
      console.log('[API /razorpay POST] provisional pending order created (admin):', { rows: rowsCount, error: error || null });
    } catch (e) {
      console.warn('[API /razorpay POST] failed to create provisional order', e);
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('[API /razorpay POST] Error creating Razorpay order:', {
      message: error?.message,
      statusCode: error?.statusCode,
      errorObject: error?.error,
      description: error?.error?.description,
      code: error?.error?.code,
      fullError: JSON.stringify(error, null, 2)
    });
    
    // Return more specific error message
    const errorMessage = error?.error?.description || error?.message || 'Something went wrong';
    const errorCode = error?.error?.code || 'UNKNOWN_ERROR';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        hint: error?.statusCode === 401 ? 'Check if Razorpay credentials are valid and active' : undefined
      },
      { status: error?.statusCode || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const crypto = require("crypto");
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database logic here
    
    return NextResponse.json({ success: true }, { status: 200 });
  } else {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
}