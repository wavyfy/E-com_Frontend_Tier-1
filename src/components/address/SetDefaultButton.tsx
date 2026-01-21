"use client";

import { useRouter } from "next/navigation";
import { AddressAPI } from "@/lib/api/address.api";
import type { Address } from "@/lib/types/address";

export default function SetDefaultButton({ address }: { address: Address }) {
  const router = useRouter();

  async function handleSetDefault() {
    await AddressAPI.setDefault(address._id);
    router.refresh(); // re-fetch server component
  }

  if (address.isDefault) {
    return <span className="text-xs font-medium text-green-400">Default</span>;
  }

  return (
    <button
      type="button"
      onClick={handleSetDefault}
      className="text-sm font-medium text-blue-400 hover:underline"
    >
      Set default
    </button>
  );
}
