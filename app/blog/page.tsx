"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { useEffect, useState } from "react"

type BlogPost = {
  id: number
  title: string
  description: string
  image?: string
  slug: string
  date?: string
  readTime?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch("/api/admin/blogs")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        if (mounted) setPosts(data || [])
      })
      .catch((err) => {
        console.error("Failed to load blogs", err)
        setPosts([])
      })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-brand-beige">
      <Header />
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-brand-green hover:text-brand-green/80 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4">Tea Wisdom Blog</h1>
          <p className="text-lg text-brand-green/80 max-w-2xl">
            Dive deep into the world of tea with our expert insights, brewing guides, and stories from the gardens of Darjeeling.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={post.image || "/blog-post-1.png"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-brand-green/60 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-brand-green mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-brand-green/80 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button className="bg-brand-green hover:bg-brand-green/90">
                      Read More
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
