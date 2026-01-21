import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import {
  fetchAdminPaymentById,
  adminUpdatePaymentStatus,
} from "@/lib/api/payment.server";
import type { AdminPaymentDetail } from "@/lib/types/payment";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  let payment: AdminPaymentDetail;

  try {
    payment = await fetchAdminPaymentById(paymentId);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  async function markStatus(formData: FormData) {
    "use server";

    const status = formData.get("status");

    if (status !== "SUCCESS" && status !== "FAILED") {
      return;
    }

    await adminUpdatePaymentStatus(payment.id, status);
  }

  // ✅ UX-friendly history (fallback for fresh payments)
  const history =
    payment.statusHistory && payment.statusHistory.length > 0
      ? payment.statusHistory
      : [
          {
            from: payment.status,
            to: payment.status,
            changedBy: "system",
            changedAt: payment.createdAt,
          },
        ];

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <h1>Payment</h1>

      {/* Summary */}
      <section style={{ marginTop: 16 }}>
        <p>
          <strong>Payment ID:</strong> {payment.id}
        </p>
        <p>
          <strong>Order ID:</strong> {payment.orderId}
        </p>
        <p>
          <strong>User ID:</strong> {payment.userId}
        </p>
        <p>
          <strong>Amount:</strong> {payment.currency} {payment.amount}
        </p>
        <p>
          <strong>Status:</strong> {payment.status}
        </p>
        <p>
          <strong>Provider:</strong> {payment.provider}
        </p>
        <p>
          <strong>Attempts:</strong> {payment.attempts}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(payment.createdAt).toLocaleString()}
        </p>
      </section>

      {/* Manual reconcile (MVP) */}
      {payment.status === "INITIATED" && (
        <section style={{ marginTop: 24 }}>
          <h3>Manual Reconciliation</h3>
          <form action={markStatus} style={{ display: "flex", gap: 12 }}>
            <button name="status" value="SUCCESS">
              Mark SUCCESS
            </button>
            <button name="status" value="FAILED">
              Mark FAILED
            </button>
          </form>
        </section>
      )}

      {/* Status history */}
      <section style={{ marginTop: 32 }}>
        <h3>Status History</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">From</th>
              <th align="left">To</th>
              <th align="left">By</th>
              <th align="left">At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr
                key={`${h.changedAt}-${i}`}
                style={{ borderTop: "1px solid #ddd" }}
              >
                <td>{h.from}</td>
                <td>{h.to}</td>
                <td style={{ fontFamily: "monospace" }}>{h.changedBy}</td>
                <td>{new Date(h.changedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
