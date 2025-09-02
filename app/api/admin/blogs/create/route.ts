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
    const blog = body?.blog;
    if (!blog || !blog.title || !blog.slug) {
      return NextResponse.json({ error: "Missing blog, title or slug" }, { status: 400 });
    }

    const insert = {
      title: blog.title,
      description: blog.description || null,
      image: blog.image || null,
      slug: blog.slug,
      content: blog.content || null,
      date: blog.date ? blog.date : null,
      read_time: blog.readTime || blog.read_time || null
    };

    const { data, error } = await supabase.from("blogs").insert([insert]).select().single();
    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("blog create error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}