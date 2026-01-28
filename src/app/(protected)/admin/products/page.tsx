import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminProducts } from "@/lib/api/server/product.server";
import AdminProductsTable from "@/components/admin/products/AdminProductsTable";
import type { Product } from "@/lib/types/product";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 20;

  let items: Product[] = [];
  let hasNextPage = false;

  try {
    const res = await fetchAdminProducts(currentPage, limit);
    items = res.items;
    hasNextPage = items.length === limit;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <AdminProductsTable
      products={items}
      currentPage={currentPage}
      hasNextPage={hasNextPage}
    />
  );
}
