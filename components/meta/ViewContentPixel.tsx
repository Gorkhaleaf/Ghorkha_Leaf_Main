"use client";

import { useEffect } from "react";

export default function ViewContentPixel({ product }: { product: any }) {
  useEffect(() => {
    if (!product) return;

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: "INR",
      });
    }
  }, [product]);

  return null; // important
}
