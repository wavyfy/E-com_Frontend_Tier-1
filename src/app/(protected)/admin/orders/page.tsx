import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminOrders } from "@/lib/api/order.server";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 10;

  let items = [];

  try {
    const res = await fetchAdminOrders(currentPage, limit);
    items = res.items;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main>
      <h1>Admin Orders</h1>

      <ul>
        {items.map((order) => (
          <li key={order._id}>
            <Link href={`/admin/orders/${order._id}`}>
              Order #{order._id.slice(-6)}
            </Link>{" "}
            — ₹{order.totalAmount} — <strong>{order.status}</strong>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        {currentPage > 1 && (
          <Link href={`/admin/orders?page=${currentPage - 1}`}>Prev</Link>
        )}
        {" | "}
        <Link href={`/admin/orders?page=${currentPage + 1}`}>Next</Link>
      </div>
    </main>
  );
}
