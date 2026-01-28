import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminPayments } from "@/lib/api/server/payment.server";
import AdminPaymentsTable from "@/components/admin/payments/AdminPaymentsTable";
import type { AdminPaymentListItem } from "@/lib/types/payment";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 10;

  let items: AdminPaymentListItem[] = [];
  let hasNextPage = false;

  try {
    const res = await fetchAdminPayments(currentPage, limit);
    items = res.items;
    hasNextPage = items.length === limit;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <AdminPaymentsTable
      payments={items}
      currentPage={currentPage}
      hasNextPage={hasNextPage}
    />
  );
}
