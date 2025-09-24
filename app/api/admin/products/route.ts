import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products } from "@/lib/products";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract filter parameters
  const collections = searchParams.get('collections')?.split(',').filter(Boolean) || [];
  const flavors = searchParams.get('flavors')?.split(',').filter(Boolean) || [];
  const qualities = searchParams.get('qualities')?.split(',').filter(Boolean) || [];
  const organic = searchParams.get('organic') === 'true';

  let productsData = products; // Default to hardcoded products

  // Try to fetch from Supabase if configured
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      const { data: supabaseProducts, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.warn("Supabase fetch products error, falling back to hardcoded data:", error);
        // Continue with hardcoded data
      } else if (supabaseProducts && supabaseProducts.length > 0) {
        // Merge Supabase data with hardcoded product details for filtering
        productsData = supabaseProducts.map(supabaseProduct => {
          const hardcodedProduct = products.find(p => p.id === supabaseProduct.id);
          return {
            ...supabaseProduct,
            ...hardcodedProduct,
            // Ensure we have the filter fields from hardcoded data
            collections: hardcodedProduct?.collections || [],
            flavors: hardcodedProduct?.flavors || [],
            qualities: hardcodedProduct?.qualities || [],
            isOrganic: hardcodedProduct?.isOrganic || false,
          };
        });
      }
    } catch (err) {
      console.warn("Supabase connection failed, using hardcoded data:", err);
      // Continue with hardcoded data
    }
  } else {
    console.info("Supabase not configured, using hardcoded products data");
  }

  try {
    // Apply filters using the products data
    let filteredProducts = productsData;

    if (collections.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        collections.some(collection =>
          (product.collections || []).includes(collection)
        )
      );
    }

    if (flavors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        flavors.some(flavor =>
          (product.flavors || []).includes(flavor)
        )
      );
    }

    if (qualities.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        qualities.some(quality =>
          (product.qualities || []).includes(quality)
        )
      );
    }

    if (organic) {
      filteredProducts = filteredProducts.filter(product => product.isOrganic);
    }

    return NextResponse.json(filteredProducts);
  } catch (err) {
    console.error("products GET error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}