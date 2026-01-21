"use client";

import { useRouter } from "next/navigation";
import { AddressAPI } from "@/lib/api/address.api";
import AddressForm from "@/components/address/AddressForm";
import type { AddressInput } from "@/lib/types/address";

export default function NewAddressClient({
  initialValues,
  returnTo,
}: {
  initialValues?: Partial<AddressInput>;
  returnTo?: string;
}) {
  const router = useRouter();

  async function handleSubmit(data: AddressInput) {
    await AddressAPI.create(data);

    // 🔑 single redirect decision
    router.replace(returnTo ?? "/account/addresses");
  }

  return (
    <AddressForm
      title="Add Address"
      submitLabel="Save"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
