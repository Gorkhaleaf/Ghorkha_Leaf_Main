import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

/**
 * Create a URL-safe slug from input (title or provided slug).
 * - lowercases, removes quotes/apostrophes, replaces non-alphanumerics with hyphens,
 *   collapses hyphens and trims leading/trailing hyphens.
 * - limits length to 200 chars.
 */
function normalizeSlug(input?: string | null) {
  if (!input) return "";
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, "") // remove quotes/apostrophes
    .replace(/[^a-z0-9]+/g, "-") // non-alnum -> hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .slice(0, 200);
}

/**
 * Ensure slug is unique in the blogs table.
 * If a conflict is found, append -2, -3, ... until unique (safe guard up to 1000).
 * If excludeId is provided, a matching row with that id is ignored (useful for updates).
 */
async function ensureUniqueSlug(supabase: any, baseSlug: string, excludeId?: number | null) {
  if (!baseSlug) return baseSlug;
  let attempt = baseSlug;
  let counter = 1;
  while (true) {
    const { data, error } = await supabase.from("blogs").select("id,slug");
    if (error) throw error;
    const exists = Array.isArray(data) && data.some((r: any) => r && r.slug === attempt && r.id !== excludeId);
    if (!exists) return attempt;
    counter++;
    attempt = `${baseSlug}-${counter}`;
    if (counter > 1000) throw new Error("Unable to generate unique slug");
  }
}

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

    // If admin provided a new title or slug, compute a normalized, unique slug
    const dbUpdates: any = {
      ...(typeof updates.title !== "undefined" ? { title: updates.title } : {}),
      ...(typeof updates.description !== "undefined" ? { description: updates.description } : {}),
      ...(typeof updates.image !== "undefined" ? { image: updates.image } : {}),
      // slug will be set below after normalization/uniqueness check
      ...(typeof updates.content !== "undefined" ? { content: updates.content } : {}),
      ...(typeof updates.date !== "undefined" ? { date: updates.date } : {}),
      ...(typeof updates.readTime !== "undefined" ? { read_time: updates.readTime } : {}),
      ...(typeof updates.read_time !== "undefined" ? { read_time: updates.read_time } : {}),
    };

    // Compute slug if title or slug provided
    let rawSlugSource: string | null = null;
    if (typeof updates.slug !== "undefined" && updates.slug !== null && updates.slug !== "") {
      rawSlugSource = updates.slug;
    } else if (typeof updates.title !== "undefined" && updates.title !== null && updates.title !== "") {
      rawSlugSource = updates.title;
    }

    if (rawSlugSource) {
      const baseSlug = normalizeSlug(rawSlugSource);
      const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug, Number(id));
      dbUpdates.slug = uniqueSlug;
    } else if (typeof updates.slug !== "undefined") {
      // admin explicitly set slug to empty string -> clear it
      dbUpdates.slug = normalizeSlug(updates.slug);
    }

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