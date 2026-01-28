import { getProductsPage } from "@/lib/data/products/getProductsPage";
import ProductGrid from "@/components/user/products/ProductGrid";
import Pagination from "@/components/common/Pagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const { items, currentPage, hasNextPage } = await getProductsPage(page);

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 12 }}>Products</h1>
      </div>

      <ProductGrid products={items} />

      <Pagination
        currentPage={currentPage}
        basePath="/products"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
