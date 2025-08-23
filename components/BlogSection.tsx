"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BlogPost {
  id: number
  title: string
  description: string
  image: string
  slug: string
  date: string
  readTime: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Perfect Tea Brewing: A Master's Guide",
    description: "Discover the ancient secrets and modern techniques that transform simple tea leaves into an extraordinary sensory experience. Learn temperature control, timing, and the subtle art of steeping that our Darjeeling masters have perfected over generations.",
    image: "/blog-post-1.png",
    slug: "art-of-perfect-tea-brewing",
    date: "December 15, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Understanding Tea Aromas: From Garden to Cup",
    description: "Explore the fascinating journey of tea aromas, from the terroir of Darjeeling gardens to the complex bouquet in your cup. Learn to identify and appreciate the subtle notes that make each Gorkha Leaf tea unique and memorable.",
    image: "/blog-post-2.png",
    slug: "understanding-tea-aromas",
    date: "December 10, 2024",
    readTime: "7 min read"
  }
]

export default function BlogSection() {
  return (
    <section className="bg-brand-beige py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-green mb-4 font-['Prosto_One']">
            Latest Tea Wisdom
          </h2>
          <p className="text-lg text-brand-green/80 max-w-2xl mx-auto">
            Discover the art, science, and heritage behind every cup of Gorkha Leaf tea
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch justify-center max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full max-w-lg mx-auto lg:mx-0 lg:flex-1 flex flex-col">
              {/* Image */}
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Meta Info */}
                <div className="flex items-center text-sm text-brand-green/60 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-brand-green mb-4 leading-tight font-['Montserrat'] line-clamp-2">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-brand-green/80 text-base leading-relaxed mb-6 line-clamp-4 font-['Montserrat'] flex-1">
                  {post.description}
                </p>

                {/* Read More Button */}
                <div className="mt-auto">
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors duration-300 font-['Montserrat'] font-medium uppercase tracking-wide"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Blog Posts Link */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button
              size="lg"
              className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 font-['Montserrat'] font-medium uppercase tracking-wide"
            >
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}