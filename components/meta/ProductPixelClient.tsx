"use client";

import { useEffect } from "react";

export default function ProductPixelClient({ product }: { product: any }) {
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

      console.log("Meta ViewContent Fired:", product.name);
    }
  }, [product]);

  return null;
}
