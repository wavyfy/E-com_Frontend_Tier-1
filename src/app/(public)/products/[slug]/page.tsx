import Link from "next/link";
import { fetchProductBySlug } from "@/lib/api/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types/product";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  let product: Product;

  try {
    product = await fetchProductBySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      {/* Back link */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/products">← Back to products</Link>
      </div>

      {/* Product layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h1>{product.name}</h1>
          <p style={{ fontSize: 18 }}>₹{product.price}</p>

          {product.description && (
            <p style={{ maxWidth: 700 }}>{product.description}</p>
          )}

          <p>Stock: {product.stock}</p>
        </div>

        {/* User Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <AddToCartButton productId={product._id} />
        </div>
      </div>
    </main>
  );
}
