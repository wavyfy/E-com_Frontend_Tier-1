import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminUserById } from "@/lib/api/user.server";
import { fetchAdminOrders } from "@/lib/api/order.server";
import { fetchAdminPayments } from "@/lib/api/payment.server";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  let user;
  let orders;
  let payments;

  try {
    [user, orders, payments] = await Promise.all([
      fetchAdminUserById(userId),
      fetchAdminOrders(1, 20),
      fetchAdminPayments(1, 20),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>User</h1>

      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      {/* Orders */}
      <h3 style={{ marginTop: 32 }}>Orders</h3>
      <ul>
        {orders.items
          .filter((o) => o.userId === userId)
          .map((o) => (
            <li key={o.id}>
              {o.id} — {o.status}
            </li>
          ))}
      </ul>

      {/* Payments */}
      <h3 style={{ marginTop: 32 }}>Payments</h3>
      <ul>
        {payments.items
          .filter((p) => p.userId === userId)
          .map((p) => (
            <li key={p.id}>
              {p.id} — {p.status}
            </li>
          ))}
      </ul>
    </main>
  );
}
