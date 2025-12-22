"use client";

import dynamic from "next/dynamic";

const CartPageClient = dynamic(() => import("./CartPageClient"), {
  ssr: false,
});

export default function Page() {
  return <CartPageClient />;
}
