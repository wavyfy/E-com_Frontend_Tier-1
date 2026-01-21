import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import {
  fetchAdminOrders,
  type AdminOrderListItem,
} from "@/lib/api/order.server";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 10;
  let items: AdminOrderListItem[] = [];
  let hasNextPage = false;

  try {
    const res = await fetchAdminOrders(currentPage, limit);
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
        <h1>All Orders</h1>
      </div>

      {/* Orders Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
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
          {items.map((order) => (
            <tr
              key={order.id || `${order.userId}-${order.createdAt}`}
              style={{ borderTop: "1px solid #ddd" }}
            >
              <td style={{ padding: "8px 0", fontFamily: "monospace" }}>
                {order.id}
              </td>
              <td style={{ fontFamily: "monospace" }}>{order.userId}</td>
              <td>
                {order.currency} {order.totalAmount}
              </td>
              <td>{order.status}</td>
              <td>{order.paymentAttempts}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/admin/orders/${order.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination (IDENTICAL TO PRODUCTS PAGE) */}
      <Pagination
        currentPage={currentPage}
        basePath="/admin/orders"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
