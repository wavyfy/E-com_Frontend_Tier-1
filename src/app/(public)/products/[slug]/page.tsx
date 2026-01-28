import Link from "next/link";
import { fetchProductBySlug } from "@/lib/api/server/product.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types/product";
import { fetchProductReviews } from "@/lib/api/server/review.server";
import ReviewSection from "@/components/reviews/ReviewSection";
import { fetchProductQuestions } from "@/lib/api/server/question.server";
import QuestionSection from "@/components/questions/QuestionSection";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  let product: Product;
  try {
    product = await fetchProductBySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  const reviews = await fetchProductReviews(product._id);
  const questions = await fetchProductQuestions(product._id);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/products">← Back to products</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h1>{product.name}</h1>
          <p style={{ fontSize: 18 }}>₹{product.price}</p>

          {product.description && (
            <p style={{ maxWidth: 700 }}>{product.description}</p>
          )}

          <p>Stock: {product.stock}</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <AddToCartButton productId={product._id} />
        </div>
      </div>

      <ReviewSection productId={product._id} initialData={reviews} />
      <QuestionSection productId={product._id} initialData={questions} />
    </main>
  );
}
