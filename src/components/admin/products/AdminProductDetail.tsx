import Link from "next/link";
import AdminProductSummary from "./AdminProductSummary";
import AdminProductActions from "./AdminProductActions";
import type { Product } from "@/lib/types/product";

export default function AdminProductDetail({ product }: { product: Product }) {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <Link href="/admin/products" className="underline text-sm">
        ← Back to products
      </Link>

      <h1 className="text-xl font-semibold">{product.name}</h1>

      <AdminProductSummary product={product} />

      <section>
        <AdminProductActions productId={product._id} />
      </section>
    </main>
  );
}
