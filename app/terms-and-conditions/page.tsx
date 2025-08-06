import { Header } from "@/components/Header"
import Footer from "@/components/Footer"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Gorkha Leaf. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing and using our website, you accept these terms and conditions in full. If you disagree with any part of these terms, please do not use our website or services.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Website Usage and Access</h2>
            <p className="text-gray-700 mb-4">
              Our website provides information about premium Darjeeling tea products and facilitates online purchases. You may access our website for personal, non-commercial use. You must not use our website for any unlawful purpose or in any way that could damage, disable, or impair our services. We reserve the right to restrict or terminate access to our website at our discretion.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Product Information and Accuracy</h2>
            <p className="text-gray-700 mb-4">
              We strive to ensure that all product descriptions, images, and pricing information on our website are accurate and up-to-date. However, we do not warrant that product descriptions, images, or other content is completely accurate, reliable, or error-free. We reserve the right to correct any errors and update information without prior notice.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Orders and Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including suspected fraud, product unavailability, or errors in pricing. Payment must be made in full before shipment. We accept various payment methods including credit cards, debit cards, net banking, and digital wallets. All transactions are processed securely through encrypted payment gateways.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              All content on this website, including text, images, logos, designs, and trademarks, is the property of Gorkha Leaf or our licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our explicit written permission.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">User Accounts and Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              When creating an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any security breach.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, Gorkha Leaf shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid by you for the specific product or service that gave rise to the claim.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our website, you consent to our data practices as described in our Privacy Policy. We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by the laws of India. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in Darjeeling, West Bengal, India. We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting on our website.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Contact Information</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please contact us at info@gorkhaleaf.com or call +91-9800341000. We are committed to addressing your concerns and ensuring a positive experience with Gorkha Leaf.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
