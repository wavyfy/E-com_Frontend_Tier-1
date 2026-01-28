"use client";

import { useRouter } from "next/navigation";
import { AddressAPI } from "@/lib/api/client/address.api";
import AddressForm from "@/components/user/address/AddressForm";
import type { Address } from "@/lib/types/address";

export default function EditAddress({ address }: { address: Address }) {
  const router = useRouter();

  async function handleSubmit(data: Partial<Address>) {
    await AddressAPI.update(address._id, data);
    router.replace("/account/addresses");
  }

  return (
    <AddressForm
      title="Edit Address"
      submitLabel="Update"
      initialValues={address}
      onSubmit={handleSubmit}
    />
  );
}
