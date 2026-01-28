import Pagination from "@/components/common/Pagination";
import AdminTable from "@/components/admin/common/AdminTable";
import AdminProductRow from "./AdminProductRow";
import AdminCreateButton from "./AdminCreateButton";
import type { Product } from "@/lib/types/product";

export default function AdminProductsTable({
  products,
  currentPage,
  hasNextPage,
}: {
  products: Product[];
  currentPage: number;
  hasNextPage: boolean;
}) {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">All Products</h1>
        <AdminCreateButton />
      </div>

      <AdminTable>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Price</th>
            <th align="right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <AdminProductRow key={product._id} product={product} />
          ))}
        </tbody>
      </AdminTable>

      <Pagination
        currentPage={currentPage}
        basePath="/admin/products"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
