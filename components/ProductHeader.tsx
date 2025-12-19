"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { BuyNowModal } from "./BuyNowModal";
import { PackOption } from "@/lib/products";

const ProductHeader = ({ product }: { product: any }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);

  // Use pack_options from Supabase if available, otherwise fall back to default
  const packOptions: PackOption[] = product.pack_options || [
    { packs: 1, price: product.price, mrp: product.originalPrice || product.mrp || product.price, discount: `${product.discount_percent || 0}% OFF` }
  ];

  const selectedPack = packOptions[selectedPackIndex];

  const handlePackChange = (index: number) => {
    setSelectedPackIndex(index);
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1, // Always 1 because we're buying 1 bundle of packs
      selectedWeight: `${selectedPack.packs} Pack${selectedPack.packs > 1 ? 's' : ''} (${product.pack_size || '100g'} each)`,
      calculatedPrice: selectedPack.price,
      price: selectedPack.price // This is the total price for the pack bundle
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setShowBuyNowModal(true);
  };

  // Create product object with selected options for BuyNowModal
  const getProductWithOptions = () => {
    return {
      ...product,
      quantity: 1, // Always 1 bundle
      selectedWeight: `${selectedPack.packs} Pack${selectedPack.packs > 1 ? 's' : ''} (${product.pack_size || '100g'} each)`,
      calculatedPrice: selectedPack.price,
      price: selectedPack.price
    };
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* Left: Product Image Gallery */}
      <div className="product-gallery">
        <div className="main-image mb-4">
          <Image 
            src={product.main_image || product.image} 
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
        
        {/* Product Description */}
        {product.description && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}
        
        {/* Pricing */}
        <div className="pricing mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-green-600">₹{selectedPack.price}</span>
            <span className="text-xl text-gray-500 line-through">₹{selectedPack.mrp}</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              {selectedPack.discount}
            </span>
          </div>
          {selectedPack.savings && (
            <p className="text-green-700 text-sm mt-2 font-medium">
              You save ₹{selectedPack.savings}!
            </p>
          )}
        </div>

        {/* Pack Selection */}
        <div className="pack-selector mb-6">
          <label className="block mb-3 font-semibold text-gray-800">
            Select Pack Size {product.pack_size && `(${product.pack_size} each)`}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {packOptions.map((pack, index) => (
              <button
                key={index}
                onClick={() => handlePackChange(index)}
                className={`relative border-2 rounded-lg p-4 text-left transition-all ${
                  selectedPackIndex === index
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {pack.savings && pack.packs > 1 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Save ₹{pack.savings}
                  </span>
                )}
                <div className="font-semibold text-gray-900">
                  {pack.packs} Pack{pack.packs > 1 ? 's' : ''}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-green-600">₹{pack.price}</span>
                  <span className="text-sm text-gray-500 line-through">₹{pack.mrp}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{pack.discount}</div>
                {selectedPackIndex === index && (
                  <Check className="absolute top-2 right-2 h-5 w-5 text-green-600" />
                )}
              </button>
            ))}
          </div>
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
      {showBuyNowModal && (
        <BuyNowModal
          product={getProductWithOptions()}
          onClose={() => setShowBuyNowModal(false)}
        />
      )}
    </div>
  );
};

export default ProductHeader;
