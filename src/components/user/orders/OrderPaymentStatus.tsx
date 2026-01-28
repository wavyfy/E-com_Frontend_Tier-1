import type { Order } from "@/lib/types/order";

export default function OrderPaymentStatus({ order }: { order: Order }) {
  const hadPaymentAttempt = order.statusHistory.some(
    (h) => h.from === "PAYMENT_PENDING",
  );

  const wasFailed = order.statusHistory.some(
    (h) => h.from === "PAYMENT_PENDING" && h.to === "CREATED",
  );

  return (
    <section className="border rounded p-4 space-y-1">
      <h2 className="font-medium">Payment</h2>

      {order.status === "PAYMENT_PENDING" && (
        <p className="text-sm text-gray-600">
          Payment is currently being processed.
        </p>
      )}

      {order.status === "CREATED" && hadPaymentAttempt && wasFailed && (
        <p className="text-sm text-red-600">
          Payment failed. No amount has been charged.
        </p>
      )}

      {order.status === "CREATED" && hadPaymentAttempt && !wasFailed && (
        <p className="text-sm text-gray-600">Payment was cancelled by you.</p>
      )}

      {order.status === "PAID" && (
        <p className="text-green-600 font-medium">✅ Payment successful</p>
      )}
    </section>
  );
}
