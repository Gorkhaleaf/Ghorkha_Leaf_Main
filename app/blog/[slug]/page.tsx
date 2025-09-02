import React from "react";
import supabase from "@/lib/supabase";
import { notFound } from "next/navigation";

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

    return (
      <main className="prose mx-auto p-6">
        <article>
          <h1>{post.title}</h1>
          {post.date && (
            <p style={{ color: "#374151", fontSize: "0.95rem" }}>
              Published:{" "}
              <time dateTime={new Date(post.date).toISOString()}>
                {new Date(post.date).toLocaleDateString()}
              </time>{" "}
              — {post.read_time || post.readTime || "—"}
            </p>
          )}
          {post.image && (
            // image URL should be public (from storage) or served via CDN
            // use simple img tag here
            <figure>
              <img src={post.image} alt={post.title} style={{ width: "100%", borderRadius: 8 }} />
            </figure>
          )}
          <div
            // content is stored as HTML in DB; render server-side
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </main>
    );
  } catch (err) {
    console.error("blog page error", err);
    return notFound();
  }
}