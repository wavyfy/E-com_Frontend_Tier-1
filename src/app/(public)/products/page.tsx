import Link from "next/link";
import { fetchProducts } from "@/lib/api/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types/product";
import { Pagination } from "@/components/common/Pagination";

export default async function ProductsPage({
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
    const res = await fetchProducts(currentPage, limit);
    items = res.items;
    hasNextPage = items.length === limit;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 12 }}>Products</h1>
      </div>

      {/* Product Grid */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {items.map((product) => (
          <li
            key={product._id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Product Info */}
            <div>
              <Link href={`/products/${product.slug}`}>
                <strong>{product.name}</strong>
              </Link>
              <div style={{ marginTop: 4 }}>₹{product.price}</div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <AddToCartButton productId={product._id} />
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        basePath="/products"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
