import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { filename, dataUrl } = await req.json();
    if (!filename || !dataUrl) {
      return NextResponse.json({ error: "Missing filename or dataUrl" }, { status: 400 });
    }

    const match = String(dataUrl).match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 });
    }

    const base64 = match[2];
    const safeName = `${Date.now()}-${filename.replace(/\s+/g, "_")}`;
    const outDir = path.join(process.cwd(), "public", "Products");

    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, safeName);

    await fs.writeFile(outPath, Buffer.from(base64, "base64"));

    const webPath = `/Products/${safeName}`;

    return NextResponse.json({ path: webPath });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}