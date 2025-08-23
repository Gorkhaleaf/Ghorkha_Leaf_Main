const ProductFeatures = () => {
  const features = [
    { icon: "🌱", title: "100% Natural", description: "No artificial additives" },
    { icon: "🏔️", title: "High Altitude", description: "Grown at 2000m+" },
    { icon: "🎯", title: "Premium Grade", description: "Hand-picked leaves" },
    { icon: "📦", title: "Fresh Packed", description: "Vacuum sealed" },
    { icon: "✅", title: "Organic", description: "Certified organic" },
    { icon: "🔥", title: "Rich Flavor", description: "Bold & aromatic" }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">This Tea Is</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeatures;