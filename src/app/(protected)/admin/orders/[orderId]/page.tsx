import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import {
  fetchAdminOrderById,
  updateAdminOrderStatus,
} from "@/lib/api/order.server";

import type { AdminOrderDetail } from "@/lib/types/order";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  let order: AdminOrderDetail;

  try {
    order = await fetchAdminOrderById(orderId);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  async function updateStatus(formData: FormData) {
    "use server";

    const status = formData.get("status");

    // 🔒 strict admin transitions
    if (status !== "PAID" && status !== "FULFILLED" && status !== "CANCELLED") {
      return;
    }

    await updateAdminOrderStatus(order.id, status);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Link href="/admin/orders">← Back to orders</Link>

      <h1 style={{ marginTop: 16 }}>Order</h1>

      {/* Summary */}
      <section style={{ marginTop: 16 }}>
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

      {/* Items */}
      <section style={{ marginTop: 24 }}>
        <h3>Items</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Product</th>
              <th align="left">Qty</th>
              <th align="left">Price</th>
              <th align="left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} style={{ borderTop: "1px solid #ddd" }}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  {order.currency} {item.unitPrice}
                </td>
                <td>
                  {order.currency} {item.subtotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Admin status actions */}
      {order.status === "PAID" && (
        <section style={{ marginTop: 24 }}>
          <h3>Admin Actions</h3>
          <form action={updateStatus} style={{ display: "flex", gap: 12 }}>
            <button name="status" value="FULFILLED">
              Mark FULFILLED
            </button>
            <button name="status" value="CANCELLED">
              Cancel Order
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
            {(order.statusHistory ?? []).map((h, i) => (
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
