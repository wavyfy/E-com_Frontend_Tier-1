import Link from "next/link";
import { fetchAdminProducts } from "@/lib/api/server/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import { AdminCreateButton } from "@/components/products/AdminCreateButton";
import { AdminProductActions } from "@/components/products/AdminProductActions";
import type { Product } from "@/lib/types/product";
import { Pagination } from "@/components/common/Pagination";

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
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h1>All Products</h1>
        <AdminCreateButton />
      </div>

      {/* Product List */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Price</th>
            <th align="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <tr key={product._id} style={{ borderTop: "1px solid #ddd" }}>
              <td style={{ padding: "8px 0" }}>
                <Link href={`/admin/products/${product._id}`}>
                  {product.name}
                </Link>
              </td>
              <td>₹{product.price}</td>
              <td align="right">
                <AdminProductActions productId={product._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        basePath="/admin/products"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
