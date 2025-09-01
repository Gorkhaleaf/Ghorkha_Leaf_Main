import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog - Gorkha Leaf',
  description: 'Discover the world of tea through our expert insights and brewing guides.',
}

const blogPosts = [
  {
    id: 1,
    title: "The Art of Perfect Tea Brewing: A Master's Guide",
    description: "Discover the ancient secrets and modern techniques that transform simple tea leaves into an extraordinary sensory experience. Learn temperature control, timing, and the subtle art of steeping.",
    image: "/blog-post-1.png",
    slug: "art-of-perfect-tea-brewing",
    date: "December 15, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Understanding Tea Aromas: From Garden to Cup",
    description: "Explore the fascinating journey of tea aromas, from the terroir of Darjeeling gardens to the complex bouquet in your cup. Learn to identify and appreciate the subtle notes that make each tea unique.",
    image: "/blog-post-2.png",
    slug: "understanding-tea-aromas",
    date: "December 10, 2024",
    readTime: "7 min read"
  }
  {
    id: 2,
    title: "Understanding Tea Aromas: From Garden to Cup",
    description: "Explore the fascinating journey of tea aromas, from the terroir of Darjeeling gardens to the complex bouquet in your cup. Learn to identify and appreciate the subtle notes that make each tea unique.",
    image: "/blog-post-2.png",
    slug: "understanding-tea-aromas",
    date: "December 10, 2024",
    readTime: "7 min read"
  }
]

export default function BlogPage() {
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

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src={post.image}
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
      </div>
      <Footer />
    </div>
  )
}
