import { fetchProductBySlug } from "@/lib/api/server/product.server";
import { fetchProductReviews } from "@/lib/api/server/review.server";
import { fetchProductQuestions } from "@/lib/api/server/question.server";
import { ApiError } from "@/lib/api/api-error";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/types/product";

export async function getProductDetailPage(slug?: string) {
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

  return {
    product,
    reviews,
    questions,
  };
}
