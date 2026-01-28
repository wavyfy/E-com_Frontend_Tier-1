import type { Order } from "@/lib/types/order";

export default function OrderItems({ order }: { order: Order }) {
  return (
    <section className="border rounded p-4 space-y-2">
      <h2 className="font-medium">Items</h2>

      <ul className="divide-y">
        {order.items.map((item) => (
          <li key={item.productId} className="py-2 flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>

            <div className="font-medium">₹{item.subtotal}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
