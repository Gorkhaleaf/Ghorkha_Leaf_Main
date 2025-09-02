import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { products as defaultProducts } from "../../../../../lib/products";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, updates } = body || {};
    if (typeof id === "undefined" || !updates) {
      return NextResponse.json({ error: "Missing id or updates" }, { status: 400 });
    }

    const runtimePath = path.join(process.cwd(), "lib", "products.runtime.json");
    let products = defaultProducts;

    try {
      const raw = await fs.readFile(runtimePath, "utf8");
      products = JSON.parse(raw);
    } catch (err) {
      // no runtime file exists yet; use defaults
    }

    const idx = products.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = { ...products[idx], ...updates };
    products[idx] = updated;

    await fs.writeFile(runtimePath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("update error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}