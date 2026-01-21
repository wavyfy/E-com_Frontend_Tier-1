// app/orders/[orderId]/address/page.tsx
import { fetchAddresses } from "@/lib/api/address.server";
import { redirect } from "next/navigation";
import OrderAddressSelect from "@/components/address/AddressSelect";
import AddressLimitNotice from "@/components/address/AddressLimitNotice";

export default async function OrderAddressPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const addresses = await fetchAddresses();

  // No addresses → create one → go to PAY
  if (!addresses.length) {
    redirect(
      `/account/addresses/new?from=checkout&returnTo=${encodeURIComponent(
        `/orders/${orderId}/pay`,
      )}`,
    );
  }

  // ✅ ONLY render selection UI
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Select Delivery Address</h1>

      <OrderAddressSelect orderId={orderId} addresses={addresses} />

      <AddressLimitNotice
        count={addresses.length}
        addHref={`/account/addresses/new?from=checkout&returnTo=${encodeURIComponent(
          `/orders/${orderId}/pay`,
        )}`}
      />
    </main>
  );
}
