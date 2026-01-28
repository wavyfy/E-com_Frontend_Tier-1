import Pagination from "@/components/common/Pagination";
import AdminTable from "@/components/admin/common/AdminTable";
import AdminOrderRow from "./AdminOrderRow";
import type { AdminOrderListItem } from "@/lib/types/order";

export default function AdminOrdersTable({
  orders,
  currentPage,
  hasNextPage,
}: {
  orders: AdminOrderListItem[];
  currentPage: number;
  hasNextPage: boolean;
}) {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-lg font-semibold">All Orders</h1>

      <AdminTable>
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
          {orders.map((order) => (
            <AdminOrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </AdminTable>

      <Pagination
        currentPage={currentPage}
        basePath="/admin/orders"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
