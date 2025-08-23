import { products, Product } from "@/lib/products"
import { Header } from "@/components/Header"
import ProductHeader from "@/components/ProductHeader"
import BrewingInstructions from "@/components/BrewingInstructions"
import IngredientsSection from "@/components/IngredientsSection"
import ProductFeatures from "@/components/ProductFeatures"
import FAQSection from "@/components/FAQSection"
import RelatedProducts from "@/components/RelatedProducts"
import CustomerReviews from "@/components/CustomerReviews"

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug)

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
    </div>
  )
}
