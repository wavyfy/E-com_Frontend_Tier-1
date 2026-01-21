// app/account/addresses/new/page.tsx
import { fetchLatestOrderWithAddress } from "@/lib/api/order.server";
import NewAddressClient from "@/components/address/NewAddressClient";
import type { AddressInput } from "@/components/address/AddressForm";

export default async function NewAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; from?: string }>;
}) {
  const { from, returnTo } = await searchParams;

  let initialValues: Partial<AddressInput> | undefined;

  if (from === "checkout") {
    const order = await fetchLatestOrderWithAddress();
    const s = order?.shippingAddressSnapshot;

    if (s) {
      // 🔑 explicit normalization
      initialValues = {
        name: s.name,
        phone: s.phone,
        line: s.line,
        city: s.city,
        state: s.state,
        postalCode: s.postalCode,
        country: s.country,
      };
    }
  }

  return <NewAddressClient initialValues={initialValues} returnTo={returnTo} />;
}
