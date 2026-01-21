"use client";

import { useRouter } from "next/navigation";
import { AddressAPI } from "@/lib/api/address.api";
import type { Address } from "@/lib/types/address";

export default function DeleteAddressButton({ address }: { address: Address }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );
    if (!confirmed) return;

    await AddressAPI.remove(address._id);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-sm font-medium text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
