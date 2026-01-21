"use client";

import { useRouter } from "next/navigation";
import { AddressAPI } from "@/lib/api/address.api";
import { OrderAPI } from "@/lib/api/order.api";
import AddressForm from "@/components/address/AddressForm";
import type { AddressInput } from "@/lib/types/address";
import { ApiError } from "@/lib/api/api-error";

export default function NewAddressClient({
  initialValues,
  returnTo,
}: {
  initialValues?: Partial<AddressInput>;
  returnTo?: string;
}) {
  const router = useRouter();

  async function handleSubmit(data: AddressInput) {
    try {
      // 1️⃣ Create address
      const address = await AddressAPI.create(data);

      // 2️⃣ If coming from checkout, attach address to order
      if (returnTo?.includes("/orders/")) {
        const match = returnTo.match(/\/orders\/([^/]+)\/pay/);
        const orderId = match?.[1];

        if (orderId) {
          await OrderAPI.attachAddress(orderId, address._id);
        }
      }

      // 3️⃣ Redirect
      router.replace(returnTo ?? "/account/addresses");
    } catch (err) {
      if (err instanceof ApiError && err.code === "ADDRESS_DUPLICATE") {
        alert("This address already exists.");
        return;
      }

      throw err;
    }
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
