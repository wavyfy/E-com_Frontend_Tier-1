"use client";

import { useRouter } from "next/navigation";
import { AddressAPI } from "@/lib/api/client/address.api";
import AddressForm from "@/components/address/AddressForm";
import type { Address } from "@/lib/types/address";

export default function EditAddressClient({ address }: { address: Address }) {
  const router = useRouter();

  return (
    <AddressForm
      title="Edit Address"
      submitLabel="Update"
      initialValues={address}
      onSubmit={async (data) => {
        await AddressAPI.update(address._id, data);
        router.replace("/account/addresses");
      }}
    />
  );
}
