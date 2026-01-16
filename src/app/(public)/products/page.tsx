import Link from "next/link";
import { fetchProducts } from "@/lib/api/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import { AdminCreateButton } from "@/components/products/AdminCreateButton";
import { AdminProductActions } from "@/components/products/AdminProductActions";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/api/product.server";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 20;

  let items: Product[] = [];

  try {
    const res = await fetchProducts(currentPage, limit);
    items = res.items;
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
        <AdminCreateButton />
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
              <AdminProductActions productId={product._id} />
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {currentPage > 1 ? (
          <Link href={`/products?page=${currentPage - 1}`}>Prev</Link>
        ) : (
          <span />
        )}

        <Link href={`/products?page=${currentPage + 1}`}>Next</Link>
      </div>
    </main>
  );
}
