import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminPayments } from "@/lib/api/payment.server";
import { Pagination } from "@/components/common/Pagination";
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
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1>All Payments</h1>
      </div>

      {/* Payments Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Payment ID</th>
            <th align="left">Order ID</th>
            <th align="left">User</th>
            <th align="left">Amount</th>
            <th align="left">Status</th>
            <th align="left">Attempts</th>
            <th align="left">Date</th>
            <th align="left">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((payment) => (
            <tr key={payment.id} style={{ borderTop: "1px solid #ddd" }}>
              <td style={{ padding: "8px 0", fontFamily: "monospace" }}>
                {payment.id}
              </td>
              <td style={{ fontFamily: "monospace" }}>{payment.orderId}</td>
              <td style={{ fontFamily: "monospace" }}>{payment.userId}</td>
              <td>
                {payment.currency} {payment.amount}
              </td>
              <td>{payment.status}</td>
              <td>{payment.attempts}</td>
              <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/admin/payments/${payment.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination — IDENTICAL to Products */}
      <Pagination
        currentPage={currentPage}
        basePath="/admin/payments"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
