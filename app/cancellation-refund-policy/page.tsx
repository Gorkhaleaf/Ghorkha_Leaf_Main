import { Header } from "@/components/Header"
import Footer from "@/components/Footer"

export default function CancellationRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-8">Cancellation & Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Gorkha Leaf, we want you to be completely satisfied with your premium Darjeeling tea purchase. Our cancellation and refund policy is designed to ensure a fair and transparent process for both order cancellations and returns, while maintaining the quality and freshness standards that our customers expect from our authentic tea products.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Order Cancellation Policy</h2>
            <p className="text-gray-700 mb-4">
              You may cancel your order within 24 hours of placement, provided the order has not been processed or shipped. Orders can be cancelled by logging into your account, contacting our customer service team at gorkhaleaf@gmail.com, or calling +91-7204390477. Once an order has been processed and shipped, it cannot be cancelled, but you may be eligible for a return under our refund policy.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Return Eligibility and Conditions</h2>
            <p className="text-gray-700 mb-4">
              We accept returns within 14 days of delivery for unopened, unused products in their original packaging. Due to the nature of food products, opened tea packages cannot be returned for hygiene and quality reasons. Damaged, defective, or incorrect items received can be returned or exchanged regardless of packaging condition. Custom or personalized orders are not eligible for return unless they arrive damaged or defective.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Refund Processing and Timeline</h2>
            <p className="text-gray-700 mb-4">
              Refunds are processed within 5-7 business days after we receive and inspect the returned items. The refund amount will be credited to your original payment method. For cancelled orders that haven't shipped, refunds are processed immediately. Shipping charges are non-refundable unless the return is due to our error, such as sending damaged or incorrect products.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Return Shipping Process</h2>
            <p className="text-gray-700 mb-4">
              Customers are responsible for return shipping costs unless the return is due to our error. We recommend using a trackable shipping method and purchasing shipping insurance for valuable returns. Once you initiate a return, we will provide you with return instructions and our return address. Please ensure items are properly packaged to prevent damage during transit.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Exchanges and Store Credit</h2>
            <p className="text-gray-700 mb-4">
              We offer exchanges for different tea varieties or sizes, subject to price differences and availability. If you prefer store credit instead of a refund, we can issue Gorkha Leaf store credit that can be used for future purchases. Store credit has no expiration date and can be combined with promotional offers and discounts.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Damaged or Defective Products</h2>
            <p className="text-gray-700 mb-4">
              If you receive damaged, defective, or incorrect products, please contact us immediately with photos of the issue. We will arrange for a replacement or full refund, including shipping costs. In cases of damage during shipping, we may file a claim with the shipping carrier and work to resolve the issue quickly to minimize inconvenience.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">International Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              International customers are responsible for return shipping costs and any applicable customs duties. Refunds for international orders may take 7-14 business days depending on banking processes and currency conversion. We recommend contacting us before initiating an international return to discuss the most cost-effective solution.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Quality Guarantee and Satisfaction</h2>
            <p className="text-gray-700 mb-4">
              We stand behind the quality of our Darjeeling teas and want you to be completely satisfied with your purchase. If you're not satisfied with the taste or quality of your tea within 30 days of purchase, please contact us to discuss a suitable resolution. Our goal is to ensure every customer enjoys the authentic Gorkha spirit in every cup.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Need Help with Returns?</h3>
              <p className="text-gray-700">
                For any questions about cancellations, returns, or refunds, please contact our customer service team at gorkhaleaf@gmail.com or call +91-7204390477. We're here to help ensure your Gorkha Leaf experience exceeds your expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
