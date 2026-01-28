import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminProductById } from "@/lib/api/server/product.server";
import type { Product } from "@/lib/types/product";
import AdminProductForm from "@/components/admin/products/AdminProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  let product: Product;

  try {
    product = await fetchAdminProductById(productId);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <AdminProductForm product={product} />
    </main>
  );
}
