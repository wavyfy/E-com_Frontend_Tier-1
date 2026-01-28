import type { AdminPaymentDetail } from "@/lib/types/payment";

export default function AdminPaymentSummary({
  payment,
}: {
  payment: AdminPaymentDetail;
}) {
  return (
    <section className="space-y-1 text-sm">
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
        <strong>Created:</strong> {new Date(payment.createdAt).toLocaleString()}
      </p>
    </section>
  );
}
