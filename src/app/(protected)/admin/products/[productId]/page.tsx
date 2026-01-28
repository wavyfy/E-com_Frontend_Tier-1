import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminProductById } from "@/lib/api/server/product.server";
import AdminProductDetail from "@/components/admin/products/AdminProductDetail";
import type { Product } from "@/lib/types/product";

export default async function AdminProductDetailPage({
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

  return <AdminProductDetail product={product} />;
}
