import Image from "next/image";

interface Ingredient {
  name: string;
  description: string;
  icon: string;
}

const IngredientsSection = ({ ingredients }: { ingredients: Ingredient[] }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Ingredients</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Image 
                src={ingredient.icon} 
                alt={ingredient.name} 
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <div>
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