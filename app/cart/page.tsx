import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

// Load the cart client component ONLY in the browser
const CartPageClient = dynamic(() => import("./CartPageClient"), {
  ssr: false,
});

export default function Page() {
  return <CartPageClient />;
}
