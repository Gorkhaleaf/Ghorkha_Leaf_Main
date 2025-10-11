/**
 * Product type definitions
 * 
 * Note: Product data is now fetched from Supabase.
 * Use functions from @/lib/supabase/products to fetch product data:
 * - getAllProducts()
 * - getProductBySlug(slug)
 * - getProductsWithFilters(filters)
 * - getProductById(id)
 */

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
  // Optional fields for product page
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
