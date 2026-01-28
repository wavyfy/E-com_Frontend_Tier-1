import type { Product } from "@/lib/types/product";

export default function ProductDetailInfo({ product }: { product: Product }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h1>{product.name}</h1>
      <p style={{ fontSize: 18 }}>₹{product.price}</p>

      {product.description && (
        <p style={{ maxWidth: 700 }}>{product.description}</p>
      )}

      <p>Stock: {product.stock}</p>
    </div>
  );
}
