import type { Product } from "@/lib/types/product";

export default function AdminProductSummary({ product }: { product: Product }) {
  return (
    <section className="space-y-1 text-sm">
      <p>
        <strong>ID:</strong> <span className="font-mono">{product._id}</span>
      </p>

      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>

      <p>
        <strong>Stock:</strong> {product.stock}
      </p>

      {product.description && (
        <p className="max-w-2xl">{product.description}</p>
      )}
    </section>
  );
}
