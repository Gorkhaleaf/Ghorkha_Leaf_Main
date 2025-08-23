import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
}

const RelatedProducts = ({ relatedProducts }: { relatedProducts: Product[] }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Frequently Purchased</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {relatedProducts.map((product, index) => (
          <Link key={index} href={`/products/${product.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                  <span className="text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm ml-1">{product.rating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;