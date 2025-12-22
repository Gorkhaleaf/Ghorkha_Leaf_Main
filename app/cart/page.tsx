"use client";

import dynamic from "next/dynamic";

export const runtime = "edge";

const CartPageClient = dynamic(() => import("./CartPageClient"), {
  ssr: false,
});

export default function Page() {
  return <CartPageClient />;
}
