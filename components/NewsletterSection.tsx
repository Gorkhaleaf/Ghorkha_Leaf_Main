import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const NewsletterSection = () => {
  return (
    <section className="py-16 bg-green-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Connected with Gorkha Leaf</h2>
        <p className="text-green-100 mb-8 max-w-2xl mx-auto">
          Get exclusive access to new arrivals, special offers, and stories from our tea gardens
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input type="email" placeholder="Enter your email" className="flex-1 bg-white text-green-800 border-0" />
          <Button className="bg-amber-600 hover:bg-amber-700 px-8">Subscribe</Button>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
