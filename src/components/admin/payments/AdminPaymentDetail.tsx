import AdminPaymentSummary from "./AdminPaymentSummary";
import AdminPaymentActions from "./AdminPaymentActions";
import AdminPaymentHistory from "./AdminPaymentHistory";
import type { AdminPaymentDetail } from "@/lib/types/payment";

export default function AdminPaymentDetail({
  payment,
}: {
  payment: AdminPaymentDetail;
}) {
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
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-lg font-semibold">Payment</h1>

      <AdminPaymentSummary payment={payment} />

      {payment.status === "INITIATED" && (
        <AdminPaymentActions paymentId={payment.id} />
      )}

      <AdminPaymentHistory history={history} />
    </main>
  );
}
