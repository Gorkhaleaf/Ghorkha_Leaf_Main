"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const ProductHeader = ({ product }: { product: any }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('100g');

  const quantityOptions = [
    { weight: '100g', multiplier: 1, quantity: 1 },
    { weight: '250g', multiplier: 2.3, quantity: 1 },
    { weight: '500g', multiplier: 4.2, quantity: 1 }
  ];

  const calculatePrice = () => {
    const selectedOption = quantityOptions.find(option => option.weight === selectedWeight);
    return selectedOption ? Math.round(product.price * selectedOption.multiplier) : product.price;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = quantityOptions.find(option => option.weight === e.target.value);
    if (selectedOption) {
      setSelectedWeight(selectedOption.weight);
      setSelectedQuantity(selectedOption.quantity);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: selectedQuantity,
      selectedWeight: selectedWeight,
      calculatedPrice: calculatePrice()
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity: selectedQuantity,
      selectedWeight: selectedWeight,
      calculatedPrice: calculatePrice()
    });
    router.push('/cart');
  };
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* Left: Product Image Gallery */}
      <div className="product-gallery">
        <div className="main-image mb-4">
          <Image 
            src={product.mainImage || product.image} 
            alt={product.name} 
            width={600}
            height={600}
            className="w-full rounded-lg"
          />
        </div>
        {product.images && product.images.length > 0 && (
          <div className="thumbnail-grid grid grid-cols-4 gap-2">
            {product.images.map((img: string, index: number) => (
              <Image
                key={index}
                src={img}
                width={100}
                height={100}
                className="w-full h-16 object-cover rounded cursor-pointer"
                alt={`${product.name} thumbnail ${index+1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Details */}
      <div className="product-info">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.subtitle || product.subname}</p>
        
        <div className="pricing mb-6">
          <span className="text-2xl font-bold text-green-600">₹{calculatePrice()}</span>
          <span className="text-lg text-gray-500 line-through ml-3">₹{Math.round(product.originalPrice * (quantityOptions.find(opt => opt.weight === selectedWeight)?.multiplier || 1))}</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded ml-3 text-sm">
            {Math.round((1 - calculatePrice()/Math.round(product.originalPrice * (quantityOptions.find(opt => opt.weight === selectedWeight)?.multiplier || 1))) * 100)}% OFF
          </span>
        </div>

        <div className="quantity-selector mb-6">
          <label className="block mb-2">Quantity</label>
          <select
            value={selectedWeight}
            onChange={handleQuantityChange}
            className="border rounded px-3 py-2 w-full"
          >
            {quantityOptions.map((option) => (
              <option key={option.weight} value={option.weight}>
                {option.weight} - ₹{Math.round(product.price * option.multiplier)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {added ? (
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                Added to Cart
              </div>
            ) : (
              "Add to Cart"
            )}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;