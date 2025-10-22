import { Header } from "@/components/Header"
import Footer from "@/components/Footer"

export default function PricingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-8">Pricing Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Gorkha Leaf, we are committed to providing transparent and fair pricing for all our premium Darjeeling tea products. Our pricing policy reflects our dedication to quality, authenticity, and the exceptional value we deliver to tea enthusiasts worldwide.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Pricing Transparency</h2>
            <p className="text-gray-700 mb-4">
              All prices displayed on our website are inclusive of applicable taxes and are clearly marked in Indian Rupees (INR). We ensure that there are no hidden charges or surprise fees during the checkout process. What you see is what you pay, reflecting our commitment to honest business practices.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Quality-Based Pricing</h2>
            <p className="text-gray-700 mb-4">
              Our pricing structure is based on several factors including tea grade, harvest season, processing methods, and rarity of the blend. Premium first flush and second flush teas command higher prices due to their exceptional quality, limited availability, and the meticulous care taken during cultivation and processing in the pristine Darjeeling hills.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Bulk and Wholesale Pricing</h2>
            <p className="text-gray-700 mb-4">
              We offer attractive bulk pricing for orders above certain quantities. Corporate clients, retailers, and tea enthusiasts looking to purchase larger quantities can benefit from our wholesale pricing structure. Please contact our sales team at gorkhaleaf@gmail.com for custom quotes on bulk orders exceeding 5 kg or for establishing wholesale partnerships.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Seasonal Pricing Adjustments</h2>
            <p className="text-gray-700 mb-4">
              Given the seasonal nature of tea production in Darjeeling, prices may vary based on harvest availability and market conditions. We strive to maintain stable pricing throughout the year while ensuring fair compensation to our tea garden partners and maintaining the highest quality standards for our customers.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Price Matching and Promotions</h2>
            <p className="text-gray-700 mb-4">
              While we believe our prices offer exceptional value for the quality provided, we occasionally run promotional campaigns and seasonal offers. Subscribe to our newsletter to stay updated on special pricing, early bird offers, and exclusive discounts for loyal customers.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">International Pricing</h2>
            <p className="text-gray-700 mb-4">
              For international customers, shipping costs and applicable customs duties are calculated separately and will be clearly displayed during checkout. We work with reliable international shipping partners to ensure cost-effective delivery while maintaining the integrity of our tea products during transit.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Contact Us</h3>
              <p className="text-gray-700">
                For any pricing inquiries, bulk orders, or wholesale partnerships, please reach out to us at gorkhaleaf@gmail.com or call +91-7204390477. Our team is committed to providing personalized pricing solutions that meet your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
