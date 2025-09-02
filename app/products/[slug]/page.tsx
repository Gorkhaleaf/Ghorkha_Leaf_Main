export const dynamic = 'force-dynamic'

import { promises as fs } from "fs"
import path from "path"
import { products as defaultProducts, Product } from "@/lib/products"
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
  let products = defaultProducts as Product[]

  try {
    const runtimePath = path.join(process.cwd(), "lib", "products.runtime.json")
    const raw = await fs.readFile(runtimePath, "utf8")
    products = JSON.parse(raw)
  } catch (err) {
    // no runtime file exists; use defaults
  }

  const product = products.find((p) => p.slug === slug)

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
