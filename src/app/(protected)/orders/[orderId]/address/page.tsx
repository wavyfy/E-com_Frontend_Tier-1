// app/orders/[orderId]/address/page.tsx
import { fetchAddresses } from "@/lib/api/address.server";
import { redirect } from "next/navigation";
import OrderAddressSelect from "@/components/address/AddressSelect";
import Link from "next/link";

export default async function OrderAddressPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const addresses = await fetchAddresses();

  // ✅ Empty state: no saved addresses → force create
  if (!addresses.length) {
    redirect(
      `/account/addresses/new?from=checkout&returnTo=${encodeURIComponent(
        `/orders/${orderId}/address`,
      )}`,
    );
  }

  // ✅ Normal selection flow
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Select Delivery Address</h1>

      <OrderAddressSelect orderId={orderId} addresses={addresses} />

      <Link
        href={`/account/addresses/new?returnTo=${encodeURIComponent(
          `/orders/${orderId}/address`,
        )}`}
        className="text-sm text-blue-600 underline"
      >
        + Add new address
      </Link>
    </main>
  );
}
