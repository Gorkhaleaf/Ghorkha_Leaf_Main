import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const body = await req.json();
    const { id, updates } = body || {};
    if (typeof id === "undefined" || !updates) {
      return NextResponse.json({ error: "Missing id or updates" }, { status: 400 });
    }

    // Map client fields to DB columns
    const dbUpdates: any = {
      ...(typeof updates.name !== "undefined" ? { name: updates.name } : {}),
      ...(typeof updates.subname !== "undefined" ? { subname: updates.subname } : {}),
      ...(typeof updates.slug !== "undefined" ? { slug: updates.slug } : {}),
      ...(typeof updates.description !== "undefined" ? { description: updates.description } : {}),
      ...(typeof updates.price !== "undefined" ? { price: updates.price } : {}),
      // image path stored in 'image' column
      ...(typeof updates.image !== "undefined" ? { image: updates.image } : {}),
      // mainImage from client maps to main_image in DB
      ...(typeof updates.mainImage !== "undefined" ? { main_image: updates.mainImage } : {}),
    };

    const { data, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update product error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("product update error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}