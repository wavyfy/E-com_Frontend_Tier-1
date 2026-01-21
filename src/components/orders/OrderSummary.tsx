// components/orders/OrderSummary.tsx
import type { Order } from "@/lib/types/order";

export default function OrderSummary({ order }: { order: Order }) {
  return (
    <section className="rounded-md border border-gray-200 p-4 space-y-3">
      <h1 className="text-lg font-semibold">Order Summary</h1>

      <ul className="space-y-2 text-sm">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.subtotal}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t pt-2 font-medium">
        <span>Total</span>
        <span>₹{order.totalAmount}</span>
      </div>
    </section>
  );
}
