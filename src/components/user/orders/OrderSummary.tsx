import type { Order } from "@/lib/types/order";

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayStatus(status: string) {
  switch (status) {
    case "CREATED":
      return "Order placed";
    case "PAYMENT_PENDING":
      return "Payment in progress";
    case "PAID":
      return "Paid";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function OrderSummary({ order }: { order: Order }) {
  return (
    <section className="border rounded p-4 space-y-1">
      <p>
        <strong>Status:</strong> {displayStatus(order.status)}
      </p>
      <p>
        <strong>Placed on:</strong> {formatDate(order.createdAt)}
      </p>
      <p>
        <strong>Items:</strong> {order.itemsCount}
      </p>
      <p>
        <strong>Total:</strong> ₹{order.totalAmount}
      </p>
    </section>
  );
}
