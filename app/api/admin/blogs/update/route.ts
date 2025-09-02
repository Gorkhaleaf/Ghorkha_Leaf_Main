import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

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

    // Map client fields to DB columns if necessary
    const dbUpdates: any = {
      ...(typeof updates.title !== "undefined" ? { title: updates.title } : {}),
      ...(typeof updates.description !== "undefined" ? { description: updates.description } : {}),
      ...(typeof updates.image !== "undefined" ? { image: updates.image } : {}),
      ...(typeof updates.slug !== "undefined" ? { slug: updates.slug } : {}),
      ...(typeof updates.content !== "undefined" ? { content: updates.content } : {}),
      ...(typeof updates.date !== "undefined" ? { date: updates.date } : {}),
      ...(typeof updates.readTime !== "undefined" ? { read_time: updates.readTime } : {}),
      ...(typeof updates.read_time !== "undefined" ? { read_time: updates.read_time } : {}),
    };

    const { data, error } = await supabase
      .from("blogs")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("blog update error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}