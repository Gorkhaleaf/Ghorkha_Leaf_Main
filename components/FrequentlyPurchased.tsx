"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/supabase/products";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

interface FrequentlyPurchasedProps {
  currentProductId: string | number;
}

const FrequentlyPurchased: React.FC<FrequentlyPurchasedProps> = ({
  currentProductId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // Filter out current product and show 3 random products
        const filtered = allProducts
          .filter((p) => p.id !== currentProductId)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching frequently purchased products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentProductId]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      selectedWeight: "50g",
    });

    setAddedItems((prev) => new Set(prev).add(product.id));

    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Purchased Together
          </h2>
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          Frequently Purchased Together
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Customers who bought this item also bought
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-green-500/20 transition-all duration-300 cursor-pointer h-full flex flex-col"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative bg-gray-50 h-56 sm:h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {product.isOrganic && (
                    <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Organic
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex flex-col flex-1 p-4">
                <div className="flex-1 mb-4" onClick={() => window.location.href = `/products/${product.slug}`}>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors duration-200 text-sm leading-tight mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  {(product.subtitle || product.subname) && (
                    <p className="text-gray-500 line-clamp-1 text-xs mb-3">
                      {product.subtitle || product.subname}
                    </p>
                  )}

                  {product.collections && product.collections.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.collections.slice(0, 2).map((collection: string, index: number) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-600 rounded-full text-xs px-2 py-1"
                        >
                          {collection}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    addedItems.has(product.id)
                      ? "bg-green-100 text-green-700 border-2 border-green-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {addedItems.has(product.id) ? (
                    <span className="flex items-center justify-center">
                      <Check className="h-4 w-4 mr-2" />
                      Added to Cart
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyPurchased;
