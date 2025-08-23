import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Understanding Tea Aromas: From Garden to Cup - Gorkha Leaf',
  description: 'Explore the fascinating journey of tea aromas, from the terroir of Darjeeling gardens to the complex bouquet in your cup.',
}

export default function TeaAromasGuide() {
  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-brand-green hover:text-brand-green/80 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <Image
                src="/blog-post-2.png"
                alt="Understanding Tea Aromas"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center text-sm text-brand-green/60 mb-4">
                <span>December 10, 2024</span>
                <span className="mx-2">•</span>
                <span>7 min read</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-6">
                Understanding Tea Aromas: From Garden to Cup
              </h1>
              
              <div className="prose prose-lg text-brand-green/80 space-y-6">
                <p className="text-xl leading-relaxed">
                  The aroma of tea is perhaps its most enchanting quality. At Gorkha Leaf, we believe that understanding these complex scents enhances every sip and connects you to the very soil where our teas grow.
                </p>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">The Science of Tea Aromas</h2>
                <p>
                  Tea aromas come from volatile organic compounds that are released when hot water meets the tea leaves. These compounds are influenced by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Terroir:</strong> Soil composition, altitude, and climate</li>
                  <li><strong>Processing:</strong> Withering, rolling, oxidation, and firing</li>
                  <li><strong>Storage:</strong> How the tea is preserved after processing</li>
                  <li><strong>Brewing:</strong> Water temperature and steeping time</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">Darjeeling's Unique Aroma Profile</h2>
                <p>
                  Our Darjeeling teas are renowned for their distinctive aroma characteristics:
                </p>
                
                <h3 className="text-xl font-semibold text-brand-green mt-6 mb-3">First Flush (Spring Harvest)</h3>
                <p>
                  The first flush brings delicate, floral aromas with hints of:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fresh green astringency</li>
                  <li>Muscatel grape notes</li>
                  <li>Light citrus undertones</li>
                  <li>Subtle vegetal freshness</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-brand-green mt-6 mb-3">Second Flush (Summer Harvest)</h3>
                <p>
                  The second flush develops richer, more complex aromas:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pronounced muscatel character</li>
                  <li>Fruity sweetness</li>
                  <li>Honey-like richness</li>
                  <li>Mature, full-bodied depth</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">How to Appreciate Tea Aromas</h2>
                <p>
                  Developing your aroma appreciation skills enhances your tea experience:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Dry Leaf Aroma:</strong> Smell the leaves before brewing to detect initial notes</li>
                  <li><strong>Wet Leaf Aroma:</strong> After the first pour, inhale the steam from the teapot</li>
                  <li><strong>Cup Aroma:</strong> Hold the cup close and breathe in before sipping</li>
                  <li><strong>Retronasal Aroma:</strong> Notice the aromas that rise through your nose as you swallow</li>
                </ol>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">The Gorkha Heritage</h2>
                <p>
                  Our tea gardens in the Darjeeling hills have been cultivating these aromatic treasures for generations. The combination of high altitude (up to 7,000 feet), cool temperatures, and the unique soil composition creates the perfect conditions for developing complex aroma compounds.
                </p>
                
                <p>
                  The morning mist that blankets our gardens plays a crucial role, slowing the growth of tea leaves and allowing them to develop their characteristic aromatic intensity. This is why Darjeeling teas, and particularly our Gorkha Leaf selections, offer such a distinctive and memorable sensory experience.
                </p>
                
                <h2 className="text-2xl font-bold text-brand-green mt-8 mb-4">Pairing Aromas with Moments</h2>
                <p>
                  Different tea aromas complement different times of day and moods:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Morning:</strong> Bright, astringent first flush for awakening</li>
                  <li><strong>Afternoon:</strong> Rich, muscatel second flush for contemplation</li>
                  <li><strong>Evening:</strong> Mellow, aged teas for relaxation</li>
                </ul>
                
                <p className="text-lg font-medium text-brand-green mt-8">
                  Next time you brew a cup of Gorkha Leaf tea, take a moment to truly appreciate the aroma. Let it transport you to the misty hills of Darjeeling, where each leaf carries the essence of our heritage.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}