import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function POST(req: NextRequest) {
  const { amount, currency = 'INR', items = null, user_id = null } = await req.json();

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_order_${randomBytes(4).toString('hex')}`,
    notes: items ? { items: JSON.stringify(items) } : undefined
  };

  try {
    const order = await razorpay.orders.create(options);

    // If client provided user_id/items, create a provisional pending order server-side
    // so webhook has a DB row to update even if client-side pre-create fails.
    if (user_id) {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const admin = createAdminClient(url, serviceKey);

        const insertPayload: any = {
          user_id,
          amount: amount,
          currency,
          items: items ?? [],
          razorpay_order_id: order.id,
          status: 'pending'
        };

        const { data, error } = await admin.from('orders').insert([insertPayload]).select();
        const rowsCount = Array.isArray(data as any) ? (data as any).length : (data ? 1 : 0);
        console.log('[API /razorpay POST] provisional pending order created (admin):', { rows: rowsCount, error: error || null });
      } catch (e) {
        console.warn('[API /razorpay POST] failed to create provisional order', e);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
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