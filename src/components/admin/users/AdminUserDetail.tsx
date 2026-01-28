import AdminUserOrders from "./AdminUserOrders";
import AdminUserPayments from "./AdminUserPayments";
import type { AdminUser } from "@/lib/types/user";
import type { AdminOrderListItem } from "@/lib/types/order";
import type { AdminPaymentListItem } from "@/lib/types/payment";

export default function AdminUserDetail({
  user,
  orders,
  payments,
}: {
  user: AdminUser;
  orders: AdminOrderListItem[];
  payments: AdminPaymentListItem[];
}) {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <section>
        <h1 className="text-xl font-semibold">User</h1>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </section>

      <AdminUserOrders orders={orders} />
      <AdminUserPayments payments={payments} />
    </main>
  );
}
