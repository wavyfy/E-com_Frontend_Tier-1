import Link from "next/link";
import AdminProductActions from "./AdminProductActions";
import type { Product } from "@/lib/types/product";

export default function AdminProductRow({ product }: { product: Product }) {
  return (
    <tr className="border-t">
      <td className="py-2">
        <Link href={`/admin/products/${product._id}`}>{product.name}</Link>
      </td>

      <td>₹{product.price}</td>

      <td align="right">
        <AdminProductActions productId={product._id} />
      </td>
    </tr>
  );
}
