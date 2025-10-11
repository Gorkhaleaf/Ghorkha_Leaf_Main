import { NextResponse } from "next/server";
import { getProductsWithFilters } from "@/lib/supabase/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const collections = searchParams.get('collections')?.split(',').filter(Boolean) || [];
    const flavors = searchParams.get('flavors')?.split(',').filter(Boolean) || [];
    const qualities = searchParams.get('qualities')?.split(',').filter(Boolean) || [];
    const organic = searchParams.get('organic') === 'true';

    // Fetch products from Supabase with filters
    const products = await getProductsWithFilters({
      collections: collections.length > 0 ? collections : undefined,
      flavors: flavors.length > 0 ? flavors : undefined,
      qualities: qualities.length > 0 ? qualities : undefined,
      organic: organic ? true : undefined,
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("products GET error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}