import { ProductAPI } from "@/lib/api/product.api";
import { AdminProductForm } from "@/components/products/AdminProductForm";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;

  try {
    product = await ProductAPI.getById(id);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err; // SERVER / NETWORK
  }

  return (
    <main>
      <AdminProductForm product={product} />
    </main>
  );
}
