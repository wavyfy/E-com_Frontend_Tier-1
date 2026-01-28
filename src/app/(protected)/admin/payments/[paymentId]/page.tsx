import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminPaymentById } from "@/lib/api/server/payment.server";
import AdminPaymentDetail from "@/components/admin/payments/AdminPaymentDetail";
import type { AdminPaymentDetail as AdminPaymentDetailType } from "@/lib/types/payment";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  let payment: AdminPaymentDetailType;

  try {
    payment = await fetchAdminPaymentById(paymentId);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return <AdminPaymentDetail payment={payment} />;
}
