import { serverFetch } from "./server-fetch";
import type {
  ProductReviewsResponse,
  AdminReviewListResponse,
} from "@/lib/types/review";

export async function fetchProductReviews(
  productId: string,
  page = 1,
  limit = 10,
): Promise<ProductReviewsResponse> {
  return serverFetch<ProductReviewsResponse>(
    `/reviews/product/${productId}?page=${page}&limit=${limit}`,
  );
}

export function fetchAdminReviews(
  params: Record<string, string | number | boolean | undefined>,
): Promise<AdminReviewListResponse> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  return serverFetch(`/admin/reviews?${qs}`);
}
