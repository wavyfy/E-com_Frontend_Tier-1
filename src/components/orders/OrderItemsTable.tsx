import type { OrderItem } from "@/lib/api/order.api";

export default function OrderItemsTable({ items }: { items: OrderItem[] }) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-right">Qty</th>
          <th className="text-right">Price</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, idx) => (
          <tr key={idx}>
            <td>{item.name}</td>
            <td className="text-right">{item.quantity}</td>
            <td className="text-right">{item.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
