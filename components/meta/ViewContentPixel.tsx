"use client";

import { useEffect } from "react";

export default function ViewContentPixel({ product }: { product: any }) {

  useEffect(() => {

    if (!product) return;
    if (typeof window === "undefined") return;
    if (!(window as any).fbq) return;

    const key = `vc_fired_${product.id}`;

    // Prevent duplicate firing in same session
    if (sessionStorage.getItem(key)) {
      return;
    }

    (window as any).fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "INR",
    });

    // Mark as fired
    sessionStorage.setItem(key, "true");

  }, [product]);

  return null;
}
