import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function POST(req: NextRequest) {
  const { amount, currency = 'INR' } = await req.json();

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_order_${randomBytes(4).toString('hex')}`,
  };

  try {
    const order = await razorpay.orders.create(options);
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