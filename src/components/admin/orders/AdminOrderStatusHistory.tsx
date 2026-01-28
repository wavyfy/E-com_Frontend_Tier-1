import type { AdminOrderDetail } from "@/lib/types/order";
import AdminTable from "@/components/admin/common/AdminTable";

export default function AdminOrderStatusHistory({
  order,
}: {
  order: AdminOrderDetail;
}) {
  if (!order.statusHistory?.length) return null;

  return (
    <section>
      <h3 className="font-medium mb-2">Status History</h3>

      <AdminTable>
        <thead>
          <tr>
            <th align="left">From</th>
            <th align="left">To</th>
            <th align="left">By</th>
            <th align="left">At</th>
          </tr>
        </thead>

        <tbody>
          {order.statusHistory.map((h, i) => (
            <tr key={`${h.changedAt}-${i}`} className="border-t">
              <td>{h.from}</td>
              <td>{h.to}</td>
              <td className="font-mono">{h.changedBy}</td>
              <td>{new Date(h.changedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </section>
  );
}
