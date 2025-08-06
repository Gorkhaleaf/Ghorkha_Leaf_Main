import { products, Product } from "@/lib/products"
import { Header } from "@/components/Header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Minus, Plus } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 ml-2">(37)</span>
            </div>
            <h1 className="text-4xl font-bold text-green-800 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{product.description}</p>

            <div className="space-y-4 mb-8">
              <div className="border rounded-lg p-4 flex justify-between items-center cursor-pointer border-green-600 bg-green-50">
                <div>
                  <p className="font-semibold">Buy 1 Pack</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">₹{product.price}</p>
                  <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex justify-between items-center cursor-pointer">
                <div>
                  <p className="font-semibold">Buy 2 Pack, <span className="text-green-600">SAVE ₹21</span></p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">₹{product.price * 2 - 21}</p>
                  <p className="text-sm text-gray-500">({`₹${((product.price * 2 - 21) / 2).toFixed(2)}/Pack`})</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex justify-between items-center cursor-pointer">
                <div>
                  <p className="font-semibold">Buy 4 Pack, <span className="text-green-600">SAVE ₹161</span></p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">₹{product.price * 4 - 161}</p>
                  <p className="text-sm text-gray-500">({`₹${((product.price * 4 - 161) / 4).toFixed(2)}/Pack`})</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
              Add to Cart
            </Button>

            <Accordion type="single" collapsible className="w-full mt-8">
              <AccordionItem value="item-1">
                <AccordionTrigger>Story Behind This Chai</AccordionTrigger>
                <AccordionContent>
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Why Premium Pricing?</AccordionTrigger>
                <AccordionContent>
                  Our teas are sourced from the highest-quality gardens and are meticulously hand-picked and processed to ensure the finest flavor and aroma.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Shipping</AccordionTrigger>
                <AccordionContent>
                  We offer free shipping on all orders above ₹999. Orders are typically delivered within 2-3 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  )
}
