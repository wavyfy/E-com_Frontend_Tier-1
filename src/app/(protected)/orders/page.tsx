// app/(protected)/orders/page.tsx
import { fetchOrders } from "@/lib/api/order.server";
import Link from "next/link";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 10;

  const res = await fetchOrders(currentPage, limit);
  const orders = res.items;

  if (!orders.length) {
    return <p className="p-4">No orders yet.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Your Orders</h1>

      <ul className="divide-y border rounded">
        {orders.map((order) => (
          <li key={order._id}>
            <Link
              href={`/orders/${order._id}`}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    Status: {order.status}
                  </p>
                </div>

                <div className="font-semibold">₹{order.totalAmount}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-between pt-2">
        <Link
          href={`/orders?page=${currentPage - 1}`}
          className={`underline ${
            currentPage === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </Link>

        <Link
          href={`/orders?page=${currentPage + 1}`}
          className={`underline ${
            orders.length < limit ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </main>
  );
}
