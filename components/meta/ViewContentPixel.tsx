"use client";

import { useEffect, useRef } from "react";

export default function ViewContentPixel({ product }: { product: any }) {

  const firedRef = useRef(false);

  useEffect(() => {

    if (!product) return;

    // Prevent duplicate firing
    if (firedRef.current) return;

    if (typeof window !== "undefined" && (window as any).fbq) {

      (window as any).fbq("track", "ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: "INR",
      });

      firedRef.current = true; // MARK AS FIRED
    }

  }, [product]);

  return null;
}
