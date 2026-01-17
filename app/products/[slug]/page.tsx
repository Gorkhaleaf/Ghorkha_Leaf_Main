export const dynamic = 'force-dynamic'

import { getProductBySlug } from "@/lib/supabase/products"
import { Product } from "@/lib/products"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import ProductHeader from "@/components/ProductHeader"
import BrewingInstructions from "@/components/BrewingInstructions"
import IngredientsSection from "@/components/IngredientsSection"
import ProductFeatures from "@/components/ProductFeatures"
import FAQSection from "@/components/FAQSection"
import RelatedProducts from "@/components/RelatedProducts"
import CustomerReviews from "@/components/CustomerReviews"
import FrequentlyPurchased from "@/components/FrequentlyPurchased"
import ViewContentPixel from "@/components/meta/ViewContentPixel"
import { Suspense } from "react";
import ProductViewTracker from "@/components/meta/ProductViewTracker";




export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params for Next.js 15
  const { slug } = await params

  // Fetch product from Supabase
  const product = await getProductBySlug(slug)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="bg-background">
      <Header />
      <ViewContentPixel product={product} />
      
      <main className="container mx-auto px-4 py-8 pt-32">
        <ProductViewTracker product={product} />
        <ProductHeader product={product} />
        <BrewingInstructions brewingInstructions={product.brewing_instructions} />
        <IngredientsSection ingredients={product.ingredients || []} />
        <ProductFeatures />
        <FAQSection faqs={product.faqs} />
        <FrequentlyPurchased currentProductId={product.id} />
        <RelatedProducts relatedProducts={product.relatedProducts || []} />
        <CustomerReviews reviews={product.reviews || []} />
      </main>
      <Footer />
    </div>
  )
}
