import { api } from "./client";
import type {
  Review,
  ProductReviewsResponse,
  AdminReviewListResponse,
  ReviewAdmin,
} from "@/lib/types/review";

export const ReviewAPI = {
  /* ---------- PUBLIC ---------- */

  listByProduct(productId: string, page = 1, limit = 10) {
    return api<ProductReviewsResponse>(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`,
    );
  },

  /* ---------- AUTH ---------- */

  getMyReview(productId: string) {
    return api<Review | null>(`/reviews/product/${productId}/me`);
  },

  upsert(productId: string, data: { rating: number; comment?: string }) {
    return api<Review>(`/reviews/product/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteMyReview(productId: string) {
    return api<void>(`/reviews/product/${productId}/me`, {
      method: "DELETE",
    });
  },

  // lib/api/client/admin.review.api.ts
  list(params: {
    page?: number;
    limit?: number;
    productId?: string;
    rating?: number;
    isVerified?: boolean;
    isHidden?: boolean;
  }) {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return api<AdminReviewListResponse>(`/admin/reviews?${qs}`);
  },

  hide(reviewId: string) {
    return api<ReviewAdmin>(`/admin/reviews/${reviewId}/hide`, {
      method: "PATCH",
    });
  },

  unhide(reviewId: string) {
    return api<ReviewAdmin>(`/admin/reviews/${reviewId}/unhide`, {
      method: "PATCH",
    });
  },

  delete(reviewId: string) {
    return api<void>(`/admin/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};
