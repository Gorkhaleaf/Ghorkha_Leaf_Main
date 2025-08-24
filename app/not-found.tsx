import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="text-center px-6 py-12 max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Go Home
            </Button>
          </Link>

          <Link href="/products">
            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
              Browse Products
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}