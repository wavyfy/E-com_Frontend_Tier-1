import Pagination from "@/components/common/Pagination";
import AdminTable from "@/components/admin/common/AdminTable";
import AdminPaymentRow from "./AdminPaymentRow";
import type { AdminPaymentListItem } from "@/lib/types/payment";

export default function AdminPaymentsTable({
  payments,
  currentPage,
  hasNextPage,
}: {
  payments: AdminPaymentListItem[];
  currentPage: number;
  hasNextPage: boolean;
}) {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-lg font-semibold">All Payments</h1>

      <AdminTable>
        <thead>
          <tr>
            <th align="left">Payment ID</th>
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
          {payments.map((payment) => (
            <AdminPaymentRow key={payment.id} payment={payment} />
          ))}
        </tbody>
      </AdminTable>

      <Pagination
        currentPage={currentPage}
        basePath="/admin/payments"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
