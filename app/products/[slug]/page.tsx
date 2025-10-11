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

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Fetch product from Supabase
  const product = await getProductBySlug(slug)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-32">
        <ProductHeader product={product} />
        <BrewingInstructions />
        <IngredientsSection ingredients={product.ingredients || []} />
        <ProductFeatures />
        <FAQSection />
        <RelatedProducts relatedProducts={product.relatedProducts || []} />
        <CustomerReviews reviews={product.reviews || []} />
      </main>
      <Footer />
    </div>
  )
}
