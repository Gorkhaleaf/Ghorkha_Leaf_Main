import { Header } from "@/components/Header"
import Footer from "@/components/Footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Gorkha Leaf, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make purchases, or interact with our services. We respect your privacy rights and strive to be transparent about our data practices.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, shipping address, billing address, and payment information. We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and time spent on our site.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your personal information to process and fulfill your orders, communicate with you about your purchases, provide customer support, and send you marketing communications if you have opted in. We also use your information to improve our website, products, and services, analyze customer behavior and preferences, prevent fraud and unauthorized activities, and comply with legal obligations and regulations.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, such as payment processors, shipping companies, and email service providers. These third parties are bound by confidentiality agreements and are prohibited from using your information for any other purpose.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Data Security and Protection</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure server environments, regular security assessments, and restricted access to personal information on a need-to-know basis. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. Cookies are small text files stored on your device that help us remember your preferences and improve our services. You can control cookie settings through your browser preferences, though disabling cookies may affect some website functionality.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal information. You can update your account information at any time by logging into your account or contacting us directly. You may also opt out of marketing communications by following the unsubscribe instructions in our emails or contacting us. We will respond to your requests within a reasonable timeframe and in accordance with applicable laws.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Data Retention and International Transfers</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. For international customers, your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information during international transfers.
            </p>

            <h2 className="text-2xl font-semibold text-green-800 mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Contact Us About Privacy</h3>
              <p className="text-gray-700">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at privacy@gorkhaleaf.com or write to us at Gorkha Leaf, Darjeeling, West Bengal, India. We are committed to addressing your privacy concerns promptly and transparently.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
