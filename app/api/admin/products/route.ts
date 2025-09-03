import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products } from "@/lib/products";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

export async function GET(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in environment");
    return NextResponse.json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { searchParams } = new URL(request.url);

  // Extract filter parameters
  const collections = searchParams.get('collections')?.split(',').filter(Boolean) || [];
  const flavors = searchParams.get('flavors')?.split(',').filter(Boolean) || [];
  const qualities = searchParams.get('qualities')?.split(',').filter(Boolean) || [];
  const organic = searchParams.get('organic') === 'true';

  try {
    // Get products from Supabase
    const { data: supabaseProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetch products error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Merge Supabase data with hardcoded product details for filtering
    const mergedProducts = (supabaseProducts || []).map(supabaseProduct => {
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

    // Apply filters using the merged data
    let filteredProducts = mergedProducts;

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