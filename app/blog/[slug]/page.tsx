import React from "react";
import supabase from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

type Params = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Params) {
  const slug = params.slug;
  if (!slug) return notFound();

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.error("Supabase blog fetch error", error);
      return notFound();
    }

    const post: any = data;

    // Normalize read time field names
    const readTime = post.readTime || post.read_time || post.read_time_text || "";

    return (
      <div className="min-h-screen bg-brand-beige">
        <Header />
        <main className="container mx-auto px-4 py-16 pt-32">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* hero image */}
              {post.image && (
                <div className="relative h-96">
                  {/* use simple img tag for server-side rendering */}
                  <img
                    src={post.image}
                    alt={post.title || "blog hero"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="p-8">
                {/* meta */}
                <div className="flex items-center text-sm text-brand-green/60 mb-4">
                  {post.date && (
                    <span>
                      <time dateTime={new Date(post.date).toISOString()}>
                        {new Date(post.date).toLocaleDateString()}
                      </time>
                    </span>
                  )}
                  <span className="mx-2">•</span>
                  <span>{readTime || "—"}</span>
                </div>

                {/* title */}
                <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-6">
                  {post.title}
                </h1>

                {/* content wrapper: admin should store ONLY inner HTML here.
                    We render it inside the consistent site markup so admins
                    only need to paste the body content. */}
                <div
                  className="prose prose-lg text-brand-green/80 space-y-6"
                  // content expected to be HTML string (sanitize before saving)
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (err) {
    console.error("blog page error", err);
    return notFound();
  }
}