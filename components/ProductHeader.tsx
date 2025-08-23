import Image from "next/image";

const ProductHeader = ({ product }: { product: any }) => {
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
          <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
          <span className="text-lg text-gray-500 line-through ml-3">₹{product.originalPrice}</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded ml-3 text-sm">
            {Math.round((1 - product.price/product.originalPrice) * 100)}% OFF
          </span>
        </div>

        <div className="quantity-selector mb-6">
          <label className="block mb-2">Quantity</label>
          <select className="border rounded px-3 py-2">
            <option>100g - ₹{product.price}</option>
            <option>250g - ₹{Math.round(product.price * 2.3)}</option>
            <option>500g - ₹{Math.round(product.price * 4.2)}</option>
          </select>
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;