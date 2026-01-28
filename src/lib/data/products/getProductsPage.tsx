import { fetchProducts } from "@/lib/api/server/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/types/product";

export async function getProductsPage(pageParam?: string) {
  const currentPage = Math.max(Number(pageParam) || 1, 1);
  const limit = 20;

  let items: Product[] = [];
  let hasNextPage = false;

  try {
    const res = await fetchProducts(currentPage, limit);
    items = res.items;
    hasNextPage = items.length === limit;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return {
    items,
    currentPage,
    hasNextPage,
  };
}
