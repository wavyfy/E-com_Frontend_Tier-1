import type { Order } from "@/lib/types/order";

export default function OrderPriceBreakdown({ order }: { order: Order }) {
  const itemsTotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <section className="border rounded p-4 space-y-2">
      <h2 className="font-medium">Price details</h2>

      <div className="flex justify-between text-sm">
        <span>Items ({order.itemsCount})</span>
        <span>₹{itemsTotal}</span>
      </div>

      <div className="flex justify-between font-semibold pt-2 border-t">
        <span>Total amount</span>
        <span>₹{order.totalAmount}</span>
      </div>
    </section>
  );
}
