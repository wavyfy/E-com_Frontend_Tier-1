// app/(protected)/account/orders/page.tsx
import { fetchOrders } from "@/lib/api/server/order.server";
import Link from "next/link";

function getDisplayStatus(status: string) {
  switch (status) {
    case "CREATED":
      return "Order placed";
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
        {orders.map((order) => {
          const firstItem = order.items?.[0];
          const moreCount =
            order.itemsCount > 1 ? ` + ${order.itemsCount - 1} more` : "";

          return (
            <li key={order._id}>
              <Link
                href={`/account/orders/${order._id}`}
                className="block p-4  space-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium">Order #{order._id.slice(-6)}</p>

                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    <p className="text-sm">
                      {firstItem?.name}
                      {moreCount}
                    </p>

                    <p className="text-sm text-gray-600">
                      Status: {getDisplayStatus(order.status)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{order.totalAmount}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-between pt-2">
        <Link
          href={`/account/orders?page=${currentPage - 1}`}
          className={`underline ${
            currentPage === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </Link>

        <Link
          href={`/account/orders?page=${currentPage + 1}`}
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
