import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'The Art of Perfect Tea Brewing: A Master\'s Guide - Gorkha Leaf',
  description: 'Discover the ancient secrets and modern techniques that transform simple tea leaves into an extraordinary sensory experience.',
}

export default function TeaBrewingGuide() {
  return (
    <div className="min-h-screen bg-brand-beige">
      <Header />
      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-brand-green hover:text-brand-green/80 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <Image
                src="/blog-post-1.png"
                alt="The Art of Perfect Tea Brewing"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center text-sm text-brand-green/60 mb-4">
                <span>December 15, 2024</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-6">
                The Art of Perfect Tea Brewing: A Master's Guide
              </h1>
              
              <div className="prose prose-lg text-brand-green/80 space-y-6">
                <p className="text-xl leading-relaxed">
                  Tea brewing is both an art and a science. At Gorkha Leaf, we've perfected the techniques passed down through generations of tea masters in the hills of Darjeeling.
                </p>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">Water Temperature: The Foundation</h2>
                <p>
                  The temperature of your water can make or break your tea experience. Different teas require different temperatures:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Black Tea:</strong> 200-212°F (93-100°C) - Full rolling boil</li>
                  <li><strong>Green Tea:</strong> 160-180°F (71-82°C) - Just before boiling</li>
                  <li><strong>White Tea:</strong> 175-185°F (79-85°C) - Gentle heat</li>
                  <li><strong>Oolong Tea:</strong> 185-205°F (85-96°C) - Hot but not boiling</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">Steeping Time: Patience Rewarded</h2>
                <p>
                  Timing is crucial. Over-steeping leads to bitterness, while under-steeping results in weak flavor. Our Darjeeling teas are crafted to reveal their complexity gradually:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>First Flush Darjeeling:</strong> 3-4 minutes for delicate floral notes</li>
                  <li><strong>Second Flush Darjeeling:</strong> 4-5 minutes for full-bodied richness</li>
                  <li><strong>Green Teas:</strong> 2-3 minutes to preserve freshness</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">The Gorkha Leaf Method</h2>
                <p>
                  Our master tea blenders recommend this traditional approach:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Warm your teapot with hot water, then empty</li>
                  <li>Add one teaspoon of tea per cup, plus one for the pot</li>
                  <li>Pour water at the correct temperature</li>
                  <li>Steep for the recommended time</li>
                  <li>Strain and serve immediately</li>
                </ol>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">The Terroir Difference</h2>
                <p>
                  What makes Gorkha Leaf teas special is our connection to the Darjeeling terroir. The high altitude, cool climate, and misty conditions create teas with unparalleled complexity. Each garden has its own character, and understanding this helps you appreciate the subtle differences in each cup.
                </p>
                
                <p className="text-lg font-medium text-brand-green mt-8">
                  Remember, the perfect cup is the one you enjoy most. Use these guidelines as a starting point, then adjust to your personal taste. Happy brewing!
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}