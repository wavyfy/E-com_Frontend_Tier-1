import Link from "next/link";
import type { AdminOrderListItem } from "@/lib/types/order";

export default function AdminUserOrders({
  orders,
}: {
  orders: AdminOrderListItem[];
}) {
  if (!orders.length) {
    return <p className="opacity-60">No orders</p>;
  }

  return (
    <section>
      <h2 className="font-medium">Orders</h2>
      <ul className="space-y-1 text-sm">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`/admin/orders/${o.id}`} className="underline">
              {o.id}
            </Link>{" "}
            — {o.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
