import Image from "next/image";
import { Leaf, Flower2, Sparkles, Sprout } from "lucide-react";

interface Ingredient {
  name: string;
  description: string;
  icon: string;
}

// Map icon names to emojis or use Lucide icons
const getIconElement = (iconName: string) => {
  const iconMap: { [key: string]: string } = {
    flower: "🌸",
    leaf: "🍃",
    seed: "🌰",
    spice: "🌶️",
    herb: "🌿",
    root: "🥕",
  };

  return iconMap[iconName.toLowerCase()] || "🌱";
};

const IngredientsSection = ({ ingredients }: { ingredients: Ingredient[] }) => {
  // Don't render if no ingredients
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Ingredients</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
              {getIconElement(ingredient.icon)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{ingredient.name}</h3>
              <p className="text-sm text-gray-600">{ingredient.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IngredientsSection;