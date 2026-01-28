import type { AdminOrderDetail } from "@/lib/types/order";

export default function AdminOrderSummary({
  order,
}: {
  order: AdminOrderDetail;
}) {
  return (
    <section className="space-y-1">
      <p>
        <strong>Order ID:</strong> {order.id}
      </p>
      <p>
        <strong>User ID:</strong> {order.userId}
      </p>
      <p>
        <strong>Total:</strong> {order.currency} {order.totalAmount}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Payment Attempts:</strong> {order.paymentAttempts}
      </p>
      <p>
        <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>
    </section>
  );
}
