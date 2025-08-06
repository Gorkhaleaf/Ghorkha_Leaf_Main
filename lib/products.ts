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
}

export const products: Product[] = [
  {
    id: 1,
    name: "Heritage Bloom",
    slug: "heritage-bloom",
    subname: "SFT4FOP – Premium Darjeeling Whole Leaf",
    description:
      "A delicately handpicked tea from the misty slopes of Darjeeling, featuring golden tips and full-bodied aroma. With notes of wildflowers and a gentle muscatel sweetness, this is a signature blend that speaks of purity and tradition.",
    type: "Black Whole Leaf Tea",
    origin: "Darjeeling Estate",
    brewing: "90°C, 3–4 min, no milk",
    bestFor: "Gifting, quiet mornings, tea lovers' ritual",
    image: "/Products/02 Heritage Bloom.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 2,
    name: "Kurseong Gold",
    slug: "kurseong-gold",
    subname: "SF-KD – Second Flush Darjeeling",
    description:
      "Harvested during Darjeeling’s famed second flush, this tea offers a smooth, amber liquor with hints of stone fruit and soft oak. A timeless classic, made for soulful evenings and storytelling.",
    type: "Second Flush Black Tea",
    origin: "Kurseong region, Darjeeling",
    tasteProfile: "Muscatel, floral, medium-bodied",
    brewing: "90°C, 3–4 min",
    image: "/Products/03 Kurseong Gold.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 3,
    name: "Hearth Roasted Reserve",
    slug: "hearth-roasted-reserve",
    subname: "SF Roasted",
    description:
      "A bold, toasty twist on traditional Darjeeling, this roasted tea brings warmth with every sip. Its nutty, smoky aroma pairs beautifully with chilly evenings and conversations that linger.",
    type: "Roasted Black Tea",
    notes: "Smoky, earthy, mellow",
    bestFor: "Autumn brews, spiced blends, creative pairings",
    brewing: "90°C, 3-4 min",
    image: "/Products/04 Hearth Roasted.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 4,
    name: "Whispering Peaks",
    slug: "whispering-peaks",
    subname: "SFT4FOP – KBD Batch",
    description:
      "From a rare and exclusive micro-lot, this limited edition batch brings the essence of high-altitude Darjeeling to your cup. Soft, nuanced, and deeply fragrant – it’s tea elevated to poetry.",
    type: "Premium Whole Leaf (Estate Marked)",
    brewing: "90°C, 3–4 min",
    availability: "Limited Batch – Only 2025 harvest",
    image: "/Products/05 Whispering Peaks.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 5,
    name: "Mother’s Garden",
    slug: "mothers-garden",
    subname: "First Flush Classic",
    description:
      "The first tender leaves of spring, plucked with care from Darjeeling’s lush slopes. This tea sings with notes of green apple, white flowers, and mountain mist. A tribute to our mothers — the first caretakers of the land.",
    type: "Darjeeling First Flush",
    tasteProfile: "Floral, crisp, light-bodied",
    mood: "Morning clarity, gratitude moments",
    brewing: "85–90°C | 3 min | No milk",
    image: "/Products/06 Mother_s Garden.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 6,
    name: "The Warrior’s Wakeup",
    slug: "the-warriors-wakeup",
    subname: "Muscatel Wonder",
    description:
      "Bold and assertive, this second flush marvel is rich in muscatel character with layers of ripe fruit and honeyed warmth. For those who rise early and rise strong.",
    type: "Second Flush Black Tea",
    tasteProfile: "Muscatel grape, wood, smooth",
    mood: "Brave starts, evening reflection",
    brewing: "90°C | 3–4 min",
    image: "/Products/07 Warrior_s Wakeup.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 7,
    name: "Dawn of the Hills",
    slug: "dawn-of-the-hills",
    subname: "Green Gold",
    description:
      "Harvested from young green leaves at dawn, this tea carries the crispness of Darjeeling air. A cup full of antioxidants and quiet strength.",
    type: "Darjeeling Green Tea",
    tasteProfile: "Grassy, soft citrus, refreshing",
    mood: "After meals, detox mornings",
    brewing: "80°C | 2–3 min",
    image: "/Products/08 Dawn of The Hills.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 8,
    name: "Heritage Harvest",
    slug: "heritage-harvest",
    subname: "AV2 Honey Muscatel",
    description:
      "Crafted from the prized AV2 clone, this tea offers the rare harmony of honey and floral notes. Rich, velvety, and unforgettable — just like the stories of our land.",
    type: "Premium Black (AV2)",
    tasteProfile: "Wild honey, orchid, muscatel",
    mood: "Gifting moments, mindful tea sessions",
    brewing: "90°C | 3–4 min",
    image: "/Products/09 Heritage Harvest.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 9,
    name: "Whispering Jasmine",
    slug: "whispering-jasmine",
    subname: "Jasmine Green",
    description:
      "A calming blend of green tea and jasmine blossoms. Soft, fragrant, and dreamy — like the fog that kisses Darjeeling’s tea gardens.",
    type: "Green + Jasmine Infusion",
    tasteProfile: "Floral, mellow, subtly sweet",
    mood: "Late-night wind down, peaceful afternoons",
    brewing: "80°C | 2–3 min",
    image: "/Products/10 Whispering Jasmine.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
  {
    id: 10,
    name: "Himalayan Zest",
    slug: "himalayan-zest",
    subname: "Lemongrass Green",
    description:
      "A spirited fusion of green tea and Himalayan lemongrass. Uplifting, citrusy, and full of life — like a fresh breeze through pine trails.",
    type: "Flavored Green Tea",
    tasteProfile: "Lemon, ginger hint, grassy",
    mood: "Work sips, post-lunch refresh",
    brewing: "85°C | 2–3 min",
    image: "/Products/11 Himalayan Zest.png",
    price: 749,
    originalPrice: 999,
    inStock: true,
  },
]
