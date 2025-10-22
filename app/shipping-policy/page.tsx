import { Header } from "@/components/Header"
import Footer from "@/components/Footer"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-8">Shipping Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Gorkha Leaf, we understand the importance of timely and secure delivery of your premium Darjeeling tea. Our comprehensive shipping policy ensures that your carefully selected teas reach you in perfect condition, maintaining their freshness and quality from our gardens to your doorstep.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Domestic Shipping (India)</h2>
            <p className="text-gray-700 mb-4">
              We offer nationwide shipping across India through trusted courier partners including Blue Dart, FedEx, and India Post. Standard delivery typically takes 3-7 business days depending on your location. Metro cities usually receive orders within 2-4 business days, while remote areas may take up to 7 business days. All domestic orders are eligible for free shipping on purchases above ₹999.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">International Shipping</h2>
            <p className="text-gray-700 mb-4">
              We proudly ship our authentic Darjeeling teas worldwide to tea enthusiasts across the globe. International shipping is available to over 50 countries including USA, UK, Canada, Australia, Germany, France, Japan, and many more. Delivery time varies by destination: 7-12 business days for most countries, with express options available for faster delivery at additional cost.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Packaging and Preservation</h2>
            <p className="text-gray-700 mb-4">
              Every order is carefully packaged using food-grade materials and protective packaging to ensure your tea maintains its optimal freshness during transit. Our loose leaf teas are sealed in airtight pouches, while tea bags are protected in moisture-resistant packaging. Fragile items like teaware are wrapped with extra cushioning to prevent damage during shipping.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Shipping Costs and Processing</h2>
            <p className="text-gray-700 mb-4">
              Domestic shipping costs start from ₹50 for orders under ₹999. International shipping costs are calculated based on weight, destination, and shipping method selected during checkout. All orders are processed within 24-48 hours from receipt of payment. Orders placed on weekends or holidays will be processed on the next business day.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Order Tracking</h2>
            <p className="text-gray-700 mb-4">
              Once your order is dispatched, you will receive a tracking number via email and SMS. You can track your shipment in real-time through our website or directly on the courier partner's website. Our customer service team is available to assist with any tracking queries or delivery concerns you may have.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Delivery Terms and Conditions</h2>
            <p className="text-gray-700 mb-4">
              Delivery attempts will be made during standard business hours. If you're unavailable, the courier will attempt redelivery or leave the package at a secure location if authorized. For international shipments, customs clearance may cause additional delays, and customers are responsible for any applicable customs duties and taxes.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Special Handling and Express Delivery</h2>
            <p className="text-gray-700 mb-4">
              We offer express delivery options for urgent orders with next-day delivery available in select metro cities. Special handling is available for bulk orders, corporate gifts, and wedding favors. Climate-controlled shipping is available during extreme weather conditions to ensure tea quality is maintained.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Shipping Support</h3>
              <p className="text-gray-700">
                For any shipping-related queries, delivery issues, or special delivery requests, please contact our customer service team at gorkhaleaf@gmail.com or call +91-7204390477. We're committed to ensuring your Gorkha Leaf tea reaches you in perfect condition.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
