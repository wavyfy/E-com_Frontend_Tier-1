import { fetchAddresses } from "@/lib/api/server/address.server";
import { redirect } from "next/navigation";
import CheckoutAddress from "@/components/user/checkout/CheckoutAddress";

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
        `/account/orders/${orderId}/pay`,
      )}`,
    );
  }

  return <CheckoutAddress orderId={orderId} addresses={addresses} />;
}
