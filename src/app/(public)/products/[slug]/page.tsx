import Link from "next/link";
import { fetchProductBySlug } from "@/lib/api/product.server";
import { AdminProductActions } from "@/components/products/AdminProductActions";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/api/product.server";

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
    <main>
      <h1>{product.name}</h1>
      <p>₹{product.price}</p>

      {product.description && <p>{product.description}</p>}
      <p>Stock: {product.stock}</p>

      <AdminProductActions productId={product._id} />

      <div style={{ marginTop: 16 }}>
        <Link href="/products">← Back to products</Link>
      </div>
    </main>
  );
}
