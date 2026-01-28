import type { AdminOrderDetail } from "@/lib/types/order";
import AdminTable from "@/components/admin/common/AdminTable";

export default function AdminOrderItemsTable({
  order,
}: {
  order: AdminOrderDetail;
}) {
  return (
    <section>
      <h3 className="font-medium mb-2">Items</h3>

      <AdminTable>
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="left">Qty</th>
            <th align="left">Price</th>
            <th align="left">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId} className="border-t">
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                {order.currency} {item.unitPrice}
              </td>
              <td>
                {order.currency} {item.subtotal}
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </section>
  );
}
