export interface Product {
  id: number
  name: string
  slug: string
  subname: string
  description: string
  type: string
  origin?: string
  brewing: string
  bestFor?: string
  image: string
  price: number
  originalPrice: number
  inStock: boolean
  tasteProfile?: string
  notes?: string
  availability?: string
  mood?: string
  // Filter properties
  collections: string[]
  originCountry?: string
  flavors: string[]
  qualities: string[]
  caffeineLevel?: string
  allergens: string[]
  isOrganic: boolean
  // New optional fields for product page
  ingredients?: {
    name: string
    description: string
    icon: string
  }[]
  relatedProducts?: {
    id: string
    name: string
    image: string
    price: number
    originalPrice: number
    rating: number
  }[]
  reviews?: {
    name: string
    rating: number
    comment: string
    date: string
  }[]
  mainImage?: string
  images?: string[]
  subtitle?: string
}

// Sample reviews to use for all products
const sampleReviews = [
  { name: "Priya S.", rating: 5, comment: "Absolutely love this tea! The aroma is divine.", date: "2025-07-15" },
  { name: "Raj K.", rating: 4, comment: "Good quality, will buy again.", date: "2025-07-20" },
  { name: "Anjali M.", rating: 5, comment: "My new favorite tea, perfect balance of flavors.", date: "2025-07-25" }
];

// Sample ingredients to use for all products
const sampleIngredients = [
  {
    name: "Tea Leaves",
    description: "Premium grade tea leaves",
    icon: "https://cdn-icons-png.flaticon.com/512/892/892152.png"
  },
  {
    name: "Cardamom",
    description: "Aromatic green cardamom pods",
    icon: "https://cdn-icons-png.flaticon.com/512/1625/1625048.png"
  },
  {
    name: "Cinnamon",
    description: "Ceylon cinnamon bark",
    icon: "https://cdn-icons-png.flaticon.com/512/2909/2909837.png"
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: "Heritage Bloom",
    slug: "heritage-bloom",
    subname: "SFT4FOP – Premium Darjeeling Whole Leaf",
    description: "A delicately handpicked tea from the misty slopes of Darjeeling, featuring golden tips and full-bodied aroma.",
    type: "Black Whole Leaf Tea",
    origin: "Darjeeling Estate",
    brewing: "90°C, 3–4 min, no milk",
    bestFor: "Gifting, quiet mornings, tea lovers' ritual",
    image: "/Products/02 Heritage Bloom.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Floral", "Sweet"],
    qualities: ["Energy"],
    caffeineLevel: "High Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "2", name: "Kurseong Gold", image: "/Products/03 Kurseong Gold.png", price: 749, originalPrice: 999, rating: 4.5 },
      { id: "3", name: "Hearth Roasted Reserve", image: "/Products/04 Hearth Roasted.png", price: 749, originalPrice: 999, rating: 4.7 },
      { id: "4", name: "Whispering Peaks", image: "/Products/05 Whispering Peaks.png", price: 749, originalPrice: 999, rating: 4.8 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/02 Heritage Bloom.png",
    images: [
      "/Products/02 Heritage Bloom-1.png",
      "/Products/02 Heritage Bloom-2.png",
      "/Products/02 Heritage Bloom-3.png"
    ],
    subtitle: "SFT4FOP – Premium Darjeeling Whole Leaf",
  },
  {
    id: 2,
    name: "Kurseong Gold",
    slug: "kurseong-gold",
    subname: "SF-KD – Second Flush Darjeeling",
    description: "Harvested during Darjeeling's famed second flush, this tea offers a smooth, amber liquor with hints of stone fruit and soft oak.",
    type: "Second Flush Black Tea",
    origin: "Kurseong region, Darjeeling",
    tasteProfile: "Muscatel, floral, medium-bodied",
    brewing: "90°C, 3–4 min",
    image: "/Products/03 Kurseong Gold.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Smooth", "Fruity", "Floral"],
    qualities: ["Relax"],
    caffeineLevel: "Medium Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "1", name: "Heritage Bloom", image: "/Products/02 Heritage Bloom.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "3", name: "Hearth Roasted Reserve", image: "/Products/04 Hearth Roasted.png", price: 749, originalPrice: 999, rating: 4.7 },
      { id: "5", name: "Mother's Garden", image: "/Products/06 Mother_s Garden.png", price: 749, originalPrice: 999, rating: 4.6 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/03 Kurseong Gold.png",
    images: [
      "/Products/03 Kurseong Gold.png",
      "/Products/03 Kurseong Gold.png",
      "/Products/03 Kurseong Gold.png"
    ],
    subtitle: "SF-KD – Second Flush Darjeeling",
  },
  {
    id: 3,
    name: "Hearth Roasted Reserve",
    slug: "hearth-roasted-reserve",
    subname: "SF Roasted",
    description: "A bold, toasty twist on traditional Darjeeling, this roasted tea brings warmth with every sip.",
    type: "Roasted Black Tea",
    notes: "Smoky, earthy, mellow",
    bestFor: "Autumn brews, spiced blends, creative pairings",
    brewing: "90°C, 3-4 min",
    image: "/Products/04 Hearth Roasted.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Spicy", "Smooth"],
    qualities: ["Energy", "Relax"],
    caffeineLevel: "High Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: false,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "2", name: "Kurseong Gold", image: "/Products/03 Kurseong Gold.png", price: 749, originalPrice: 999, rating: 4.5 },
      { id: "4", name: "Whispering Peaks", image: "/Products/05 Whispering Peaks.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "6", name: "The Warrior's Wakeup", image: "/Products/07 Warrior_s Wakeup.png", price: 749, originalPrice: 999, rating: 4.7 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/04 Hearth Roasted.png",
    images: [
      "/Products/04 Hearth Roasted.png",
      "/Products/04 Hearth Roasted.png",
      "/Products/04 Hearth Roasted.png"
    ],
    subtitle: "SF Roasted",
  },
  {
    id: 4,
    name: "Whispering Peaks",
    slug: "whispering-peaks",
    subname: "SFT4FOP – KBD Batch",
    description: "From a rare and exclusive micro-lot, this limited edition batch brings the essence of high-altitude Darjeeling to your cup.",
    type: "Premium Whole Leaf (Estate Marked)",
    brewing: "90°C, 3–4 min",
    availability: "Limited Batch – Only 2025 harvest",
    image: "/Products/05 Whispering Peaks.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Floral", "Smooth"],
    qualities: ["Relax"],
    caffeineLevel: "Medium Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "1", name: "Heritage Bloom", image: "/Products/02 Heritage Bloom.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "3", name: "Hearth Roasted Reserve", image: "/Products/04 Hearth Roasted.png", price: 749, originalPrice: 999, rating: 4.7 },
      { id: "5", name: "Mother's Garden", image: "/Products/06 Mother_s Garden.png", price: 749, originalPrice: 999, rating: 4.6 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/05 Whispering Peaks.png",
    images: [
      "/Products/05 Whispering Peaks.png",
      "/Products/05 Whispering Peaks.png",
      "/Products/05 Whispering Peaks.png"
    ],
    subtitle: "SFT4FOP – KBD Batch",
  },
  {
    id: 5,
    name: "Mother's Garden",
    slug: "mothers-garden",
    subname: "First Flush Classic",
    description: "The first tender leaves of spring, plucked with care from Darjeeling's lush slopes.",
    type: "Darjeeling First Flush",
    tasteProfile: "Floral, crisp, light-bodied",
    mood: "Morning clarity, gratitude moments",
    brewing: "85–90°C | 3 min | No milk",
    image: "/Products/06 Mother_s Garden.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Floral", "Fruity", "Citrus"],
    qualities: ["Energy", "Detox"],
    caffeineLevel: "Low Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "2", name: "Kurseong Gold", image: "/Products/03 Kurseong Gold.png", price: 749, originalPrice: 999, rating: 4.5 },
      { id: "4", name: "Whispering Peaks", image: "/Products/05 Whispering Peaks.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "7", name: "Dawn of the Hills", image: "/Products/08 Dawn of The Hills.png", price: 749, originalPrice: 999, rating: 4.6 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/06 Mother_s Garden.png",
    images: [
      "/Products/06 Mother_s Garden.png",
      "/Products/06 Mother_s Garden.png",
      "/Products/06 Mother_s Garden.png"
    ],
    subtitle: "First Flush Classic",
  },
  {
    id: 6,
    name: "The Warrior's Wakeup",
    slug: "the-warriors-wakeup",
    subname: "Muscatel Wonder",
    description: "Bold and assertive, this second flush marvel is rich in muscatel character with layers of ripe fruit and honeyed warmth.",
    type: "Second Flush Black Tea",
    tasteProfile: "Muscatel grape, wood, smooth",
    mood: "Brave starts, evening reflection",
    brewing: "90°C | 3–4 min",
    image: "/Products/07 Warrior_s Wakeup.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Sweet", "Fruity", "Smooth"],
    qualities: ["Energy"],
    caffeineLevel: "High Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: false,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "1", name: "Heritage Bloom", image: "/Products/02 Heritage Bloom.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "3", name: "Hearth Roasted Reserve", image: "/Products/04 Hearth Roasted.png", price: 749, originalPrice: 999, rating: 4.7 },
      { id: "8", name: "Heritage Harvest", image: "/Products/09 Heritage Harvest.png", price: 749, originalPrice: 999, rating: 4.9 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/07 Warrior_s Wakeup.png",
    images: [
      "/Products/07 Warrior_s Wakeup.png",
      "/Products/07 Warrior_s Wakeup.png",
      "/Products/07 Warrior_s Wakeup.png"
    ],
    subtitle: "Muscatel Wonder",
  },
  {
    id: 7,
    name: "Dawn of the Hills",
    slug: "dawn-of-the-hills",
    subname: "Green Gold",
    description: "Harvested from young green leaves at dawn, this tea carries the crispness of Darjeeling air.",
    type: "Darjeeling Green Tea",
    tasteProfile: "Grassy, soft citrus, refreshing",
    mood: "After meals, detox mornings",
    brewing: "80°C | 2–3 min",
    image: "/Products/08 Dawn of The Hills.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Green teas"],
    originCountry: "India",
    flavors: ["Grassy", "Citrus"],
    qualities: ["Detox", "Energy"],
    caffeineLevel: "Low Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "5", name: "Mother's Garden", image: "/Products/06 Mother_s Garden.png", price: 749, originalPrice: 999, rating: 4.6 },
      { id: "9", name: "Whispering Jasmine", image: "/Products/10 Whispering Jasmine.png", price: 749, originalPrice: 999, rating: 4.7 },
      { id: "10", name: "Himalayan Zest", image: "/Products/11 Himalayan Zest.png", price: 749, originalPrice: 999, rating: 4.8 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/08 Dawn of The Hills.png",
    images: [
      "/Products/08 Dawn of The Hills.png",
      "/Products/08 Dawn of The Hills.png",
      "/Products/08 Dawn of The Hills.png"
    ],
    subtitle: "Green Gold",
  },
  {
    id: 8,
    name: "Heritage Harvest",
    slug: "heritage-harvest",
    subname: "AV2 Honey Muscatel",
    description: "Crafted from the prized AV2 clone, this tea offers the rare harmony of honey and floral notes.",
    type: "Premium Black (AV2)",
    tasteProfile: "Wild honey, orchid, muscatel",
    mood: "Gifting moments, mindful tea sessions",
    brewing: "90°C | 3–4 min",
    image: "/Products/09 Heritage Harvest.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Black teas"],
    originCountry: "India",
    flavors: ["Sweet", "Floral", "Creamy"],
    qualities: ["Relax"],
    caffeineLevel: "Medium Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "1", name: "Heritage Bloom", image: "/Products/02 Heritage Bloom.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "4", name: "Whispering Peaks", image: "/Products/05 Whispering Peaks.png", price: 749, originalPrice: 999, rating: 4.8 },
      { id: "6", name: "The Warrior's Wakeup", image: "/Products/07 Warrior_s Wakeup.png", price: 749, originalPrice: 999, rating: 4.7 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/09 Heritage Harvest.png",
    images: [
      "/Products/09 Heritage Harvest.png",
      "/Products/09 Heritage Harvest.png",
      "/Products/09 Heritage Harvest.png"
    ],
    subtitle: "AV2 Honey Muscatel",
  },
  {
    id: 9,
    name: "Whispering Jasmine",
    slug: "whispering-jasmine",
    subname: "Jasmine Green",
    description: "A calming blend of green tea and jasmine blossoms.",
    type: "Green + Jasmine Infusion",
    tasteProfile: "Floral, mellow, subtly sweet",
    mood: "Late-night wind down, peaceful afternoons",
    brewing: "80°C | 2–3 min",
    image: "/Products/10 Whispering Jasmine.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Green teas", "Herbal teas"],
    originCountry: "India",
    flavors: ["Floral", "Sweet"],
    qualities: ["Relax"],
    caffeineLevel: "Low Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "7", name: "Dawn of the Hills", image: "/Products/08 Dawn of The Hills.png", price: 749, originalPrice: 999, rating: 4.6 },
      { id: "5", name: "Mother's Garden", image: "/Products/06 Mother_s Garden.png", price: 749, originalPrice: 999, rating: 4.6 },
      { id: "10", name: "Himalayan Zest", image: "/Products/11 Himalayan Zest.png", price: 749, originalPrice: 999, rating: 4.8 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/10 Whispering Jasmine.png",
    images: [
      "/Products/10 Whispering Jasmine.png",
      "/Products/10 Whispering Jasmine.png",
      "/Products/10 Whispering Jasmine.png"
    ],
    subtitle: "Jasmine Green",
  },
  {
    id: 10,
    name: "Himalayan Zest",
    slug: "himalayan-zest",
    subname: "Lemongrass Green",
    description: "A spirited fusion of green tea and Himalayan lemongrass.",
    type: "Flavored Green Tea",
    tasteProfile: "Lemon, ginger hint, grassy",
    mood: "Work sips, post-lunch refresh",
    brewing: "85°C | 2–3 min",
    image: "/Products/11 Himalayan Zest.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
    collections: ["Green teas"],
    originCountry: "India",
    flavors: ["Citrus", "Grassy", "Minty"],
    qualities: ["Energy", "Digestion"],
    caffeineLevel: "Low Caffeine",
    allergens: ["Gluten-free", "Lactose-free", "Nuts-free", "Soy-free"],
    isOrganic: true,
    ingredients: sampleIngredients,
    relatedProducts: [
      { id: "7", name: "Dawn of the Hills", image: "/Products/08 Dawn of The Hills.png", price: 749, originalPrice: 999, rating: 4.6 },
      { id: "9", name: "Whispering Jasmine", image: "/Products/10 Whispering Jasmine.png", price: 749, originalPrice: 999, rating: 4.7 },
      { id: "5", name: "Mother's Garden", image: "/Products/06 Mother_s Garden.png", price: 749, originalPrice: 999, rating: 4.6 }
    ],
    reviews: sampleReviews,
    mainImage: "/Products/11 Himalayan Zest.png",
    images: [
      "/Products/11 Himalayan Zest.png",
      "/Products/11 Himalayan Zest.png",
      "/Products/11 Himalayan Zest.png"
    ],
    subtitle: "Lemongrass Green",
  },
]
