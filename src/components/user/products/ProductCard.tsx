import Link from "next/link";
import AddToCartButton from "@/components/user/cart/AddToCartButton";
import type { Product } from "@/lib/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <li
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
  );
}
