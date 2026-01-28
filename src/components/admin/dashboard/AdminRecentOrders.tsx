import Link from "next/link";
import type { AdminDashboardOrder } from "@/lib/types/admin-dashboard";

export default function AdminRecentOrders({
  orders,
}: {
  orders: AdminDashboardOrder[];
}) {
  return (
    <section>
      <h3 className="font-medium mb-2">Recent Orders</h3>
      <ul className="space-y-1 text-sm">
        {orders.map((o) => (
          <li key={o._id}>
            <Link href={`/admin/orders/${o._id}`} className="underline">
              {o._id}
            </Link>{" "}
            — {o.status} — {o.currency} {o.totalAmount}
          </li>
        ))}
      </ul>
    </section>
  );
}
