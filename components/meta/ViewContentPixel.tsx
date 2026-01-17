"use client";

import { useEffect, useRef } from "react";

export default function ViewContentPixel({ product }: { product: any }) {

  const firedRef = useRef(false);

  useEffect(() => {

    if (!product) return;

    // Prevent multiple fires
    if (firedRef.current) return;

    firedRef.current = true;

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

  return null;
}
