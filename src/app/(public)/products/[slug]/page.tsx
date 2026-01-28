import Link from "next/link";
import { getProductDetailPage } from "@/lib/data/products/getProductDetailPage";
import ProductReviews from "@/components/user/reviews/ProductReviews";
import ProductQuestions from "@/components/user/questions/ProductQuestions";
import ProductDetailInfo from "@/components/user/products/ProductDetailInfo";
import AddToCartButton from "@/components/user/cart/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { product, reviews, questions } = await getProductDetailPage(slug);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/products">← Back to products</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ProductDetailInfo product={product} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <AddToCartButton productId={product._id} />
        </div>
      </div>

      <ProductReviews productId={product._id} initialData={reviews} />
      <ProductQuestions productId={product._id} initialData={questions} />
    </main>
  );
}
