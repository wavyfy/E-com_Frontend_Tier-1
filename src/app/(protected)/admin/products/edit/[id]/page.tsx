import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminProductById } from "@/lib/api/product.server";
import type { Product } from "@/lib/types/product";
import { AdminProductForm } from "@/components/products/AdminProductForm";

export default async function EditProductPage({
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
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <AdminProductForm product={product} />
    </main>
  );
}
