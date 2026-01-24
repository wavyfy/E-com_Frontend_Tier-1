import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import type { Product } from "@/lib/types/product";
import { fetchAdminProductById } from "@/lib/api/server/product.server";
import { AdminProductActions } from "@/components/products/AdminProductActions";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;

  try {
    product = await fetchAdminProductById(id);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Link href="/admin/products">← Back to products</Link>

      <h1 style={{ marginTop: 16 }}>{product.name}</h1>

      <p>
        <strong>ID:</strong>{" "}
        <span style={{ fontFamily: "monospace" }}>{product._id}</span>
      </p>
      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>
      <p>
        <strong>Stock:</strong> {product.stock}
      </p>

      {product.description && (
        <p style={{ maxWidth: 700 }}>{product.description}</p>
      )}

      {/* Admin Actions */}
      <div style={{ marginTop: 24 }}>
        <AdminProductActions productId={product._id} />
      </div>
    </main>
  );
}
