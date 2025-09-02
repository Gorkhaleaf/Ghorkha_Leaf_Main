import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { products as defaultProducts } from "../../../../lib/products";

export async function GET() {
  const runtimePath = path.join(process.cwd(), "lib", "products.runtime.json");
  try {
    const data = await fs.readFile(runtimePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json(defaultProducts);
  }
}