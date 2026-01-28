import type { Order } from "@/lib/types/order";
import { useRouter } from "next/navigation";

export default function CheckoutPayAddress({ order }: { order: Order }) {
  const router = useRouter();
  const a = order.shippingAddressSnapshot;
  if (!a) return null;

  return (
    <section className="border rounded p-3 space-y-2">
      <div className="flex justify-between">
        <h2 className="font-medium">Delivery Address</h2>
        <button
          onClick={() => router.push(`/account/orders/${order._id}/address`)}
          className="text-sm text-blue-600 underline"
        >
          Change
        </button>
      </div>

      <div className="text-sm">
        <p className="font-medium">{a.name}</p>
        <p>{a.line}</p>
        <p>
          {a.postalCode}, {a.city}, {a.state}
        </p>
        <p>{a.country}</p>
        <p>{a.phone}</p>
      </div>
    </section>
  );
}
