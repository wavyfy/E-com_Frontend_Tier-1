import { serverFetch } from "./server-fetch";
import type { PaginatedPayments, AdminPaymentDetail } from "@/lib/types/payment";

export async function fetchAdminPayments(
  page = 1,
  limit = 10,
): Promise<PaginatedPayments> {
  return serverFetch<PaginatedPayments>(
    `/admin/payments?page=${page}&limit=${limit}`,
  );
}

export async function fetchAdminPaymentById(
  paymentId: string,
): Promise<AdminPaymentDetail> {
  return serverFetch<AdminPaymentDetail>(`/admin/payments/${paymentId}`);
}

export async function adminUpdatePaymentStatus(
  paymentId: string,
  status: "SUCCESS" | "FAILED",
): Promise<AdminPaymentDetail> {
  return serverFetch<AdminPaymentDetail>(
    `/admin/payments/${paymentId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );
}
