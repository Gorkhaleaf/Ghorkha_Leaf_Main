import { NextRequest, NextResponse } from "next/server";
import { getShiprocketToken } from "../token";

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    const token = await getShiprocketToken();

    const payload = {
      order_id: order.order_number,
      order_date: new Date().toISOString().split("T")[0],
      channel_id: Number(process.env.SHIPROCKET_CHANNEL_ID),

      billing_customer_name: order.name,
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pincode,
      billing_state: order.state,
      billing_country: "India",
      billing_email: order.email,
      billing_phone: order.phone,

      shipping_is_billing: true,

      order_items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.sku || item.id.toString(),
        units: item.quantity,
        selling_price: item.price,
      })),

      payment_method: "Prepaid",
      sub_total: order.total,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const response = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Shiprocket error" },
      { status: 500 }
    );
  }
}
