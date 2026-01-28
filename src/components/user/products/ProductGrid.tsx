import type { Product } from "@/lib/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
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
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </ul>
  );
}
