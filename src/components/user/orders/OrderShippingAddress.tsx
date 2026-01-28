import type { Order } from "@/lib/types/order";

export default function OrderShippingAddress({ order }: { order: Order }) {
  if (!order.shippingAddressSnapshot) return null;

  const a = order.shippingAddressSnapshot;

  return (
    <section className="border rounded p-4 space-y-1">
      <h2 className="font-medium">Shipping address</h2>
      <p>{a.name}</p>
      <p>{a.phone}</p>
      <p>
        {a.line}, {a.city}, {a.state}
      </p>
      <p>
        {a.postalCode}, {a.country}
      </p>
    </section>
  );
}
