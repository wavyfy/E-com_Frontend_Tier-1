import { serverFetch } from "./server-fetch";
import type {
  ProductQuestionsResponse,
  AdminQuestionListResponse,
} from "@/lib/types/question";

export function fetchProductQuestions(
  productId: string,
  page = 1,
  limit = 10,
): Promise<ProductQuestionsResponse> {
  return serverFetch(
    `/questions/product/${productId}?page=${page}&limit=${limit}`,
  );
}

export async function fetchAdminQuestions(params: {
  page?: number;
  productId?: string;
  answered?: boolean;
  isHidden?: boolean;
}) {
  const qs = new URLSearchParams();

  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.productId !== undefined) qs.set("productId", params.productId);
  if (params.answered !== undefined)
    qs.set("answered", String(params.answered));
  if (params.isHidden !== undefined)
    qs.set("isHidden", String(params.isHidden));

  return serverFetch<AdminQuestionListResponse>(
    `/admin/questions?${qs.toString()}`,
  );
}
