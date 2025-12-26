import Link from "next/link";
import { fetchProducts } from "@/lib/api/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import { AdminCreateButton } from "@/components/products/AdminCreateButton";
import { AdminProductActions } from "@/components/products/AdminProductActions";
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
    <main>
      <h1>Products</h1>

      <AdminCreateButton />

      <ul>
        {items.map((product) => (
          <li key={product._id}>
            <Link href={`/products/${product.slug}`}>{product.name}</Link> — ₹
            {product.price}
            <AdminProductActions productId={product._id} />
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        {currentPage > 1 && (
          <Link href={`/products?page=${currentPage - 1}`}>Prev</Link>
        )}
        {" | "}
        <Link href={`/products?page=${currentPage + 1}`}>Next</Link>
      </div>
    </main>
  );
}
