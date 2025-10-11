import supabase from "@/lib/supabase";
import { Product } from "@/lib/products";

// Database row type (snake_case from Supabase)
// Matches your existing products table schema
interface ProductRow {
  id: number;
  name: string;
  slug?: string;
  subname?: string;
  description?: string;
  price?: number;
  image?: string;
  main_image?: string;
  created_at?: string;
  collections?: string[];
  flavors?: string[];
  qualities?: string[];
  is_organic?: boolean;
  origin_country?: string;
  caffeine_level?: string;
  allergens?: string[];
}

/**
 * Convert database row (snake_case) to Product type (camelCase)
 * Maps your existing schema to the Product interface
 */
function mapProductRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || "",
    subname: row.subname || "",
    description: row.description || "",
    type: "", // Not in your current schema
    origin: undefined,
    brewing: "",
    bestFor: undefined,
    image: row.image || "",
    price: Number(row.price || 0),
    originalPrice: Number(row.price || 0), // Same as price since original_price doesn't exist
    inStock: true, // Default to true since in_stock column doesn't exist
    tasteProfile: undefined,
    notes: undefined,
    availability: undefined,
    mood: undefined,
    collections: row.collections || [],
    originCountry: row.origin_country,
    flavors: row.flavors || [],
    qualities: row.qualities || [],
    caffeineLevel: row.caffeine_level,
    allergens: row.allergens || [],
    isOrganic: row.is_organic || false,
    ingredients: undefined, // Not in your current schema
    relatedProducts: undefined, // Not in your current schema
    reviews: undefined, // Not in your current schema
    mainImage: row.main_image || row.image,
    images: [], // Not in your current schema
    subtitle: row.subname,
  };
}

/**
 * Fetch all products from Supabase
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching products from Supabase:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapProductRowToProduct);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

/**
 * Fetch a single product by slug from Supabase
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Error fetching product with slug "${slug}":`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapProductRowToProduct(data);
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch products with filters
 */
export async function getProductsWithFilters(filters: {
  collections?: string[];
  flavors?: string[];
  qualities?: string[];
  organic?: boolean;
}): Promise<Product[]> {
  try {
    let query = supabase
      .from("products")
      .select("*");

    // Filter by collections (overlap with any of the provided collections)
    if (filters.collections && filters.collections.length > 0) {
      query = query.overlaps("collections", filters.collections);
    }

    // Filter by flavors (overlap with any of the provided flavors)
    if (filters.flavors && filters.flavors.length > 0) {
      query = query.overlaps("flavors", filters.flavors);
    }

    // Filter by qualities (overlap with any of the provided qualities)
    if (filters.qualities && filters.qualities.length > 0) {
      query = query.overlaps("qualities", filters.qualities);
    }

    // Filter by organic
    if (filters.organic === true) {
      query = query.eq("is_organic", true);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      console.error("Error fetching filtered products from Supabase:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapProductRowToProduct);
  } catch (error) {
    console.error("Failed to fetch filtered products:", error);
    return [];
  }
}

/**
 * Fetch product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching product with id "${id}":`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapProductRowToProduct(data);
  } catch (error) {
    console.error(`Failed to fetch product with id "${id}":`, error);
    return null;
  }
}
