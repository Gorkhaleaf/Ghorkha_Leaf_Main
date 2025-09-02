import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

/**
 * Normalize admin-submitted HTML so we store only the article body.
 * - If admin pastes a full page (<main>, <article>, or a wrapper with class "prose"),
 *   extract the inner HTML and store that.
 * - Otherwise store the provided content as-is.
 */
function normalizeContent(raw?: string | null) {
  if (!raw) return null;
  const content = String(raw);

  // Try to extract <div class="...prose...">...</div>
  const proseRegex = /<div[^>]*class=(["'])(?:(?!\1)[\s\S])*?\bprose\b[\s\S]*?\1[^>]*>([\s\S]*?)<\/div>/i;
  const proseMatch = content.match(proseRegex);
  if (proseMatch && proseMatch[2]) {
    return proseMatch[2].trim();
  }

  // Try to extract <article>...</article>
  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch && articleMatch[1]) {
    return articleMatch[1].trim();
  }

  // Try to extract <main>...</main>
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch && mainMatch[1]) {
    return mainMatch[1].trim();
  }

  // Fallback: return the original string trimmed
  return content.trim();
}

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
    const { data, error } = await supabase.from("blogs").select("id");
    if (error) throw error;
    // Filter client-side because we used a broad select above to avoid server errors with single()
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
    const blog = body?.blog;
    if (!blog || !blog.title) {
      return NextResponse.json({ error: "Missing blog or title" }, { status: 400 });
    }

    // compute slug from provided slug or title and normalize it
    const rawSlugSource = blog.slug || blog.title;
    const baseSlug = normalizeSlug(rawSlugSource);
    // ensure uniqueness
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);

    // Normalize content so admins can paste either inner HTML or a full page.
    const normalizedContent = normalizeContent(blog.content || null);

    const insert = {
      title: blog.title,
      description: blog.description || null,
      image: blog.image || null,
      slug: uniqueSlug,
      // store only the article/body HTML (renderer will wrap it in site layout)
      content: normalizedContent || blog.content || null,
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