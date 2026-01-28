"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressAPI } from "@/lib/api/client/address.api";
import type { Address } from "@/lib/types/address";

export default function SetDefaultButton({ address }: { address: Address }) {
  const router = useRouter();
  const [setting, setSetting] = useState(false);

  async function handleSetDefault() {
    if (setting) return;

    try {
      setSetting(true);
      await AddressAPI.setDefault(address._id);
      router.refresh(); 
    } finally {
      setSetting(false);
    }
  }

  if (address.isDefault) {
    return <span className="text-xs font-medium text-green-400">Default</span>;
  }

  return (
    <button
      type="button"
      onClick={handleSetDefault}
      disabled={setting}
      className="text-sm font-medium text-blue-400 hover:underline disabled:opacity-50"
    >
      {setting ? "Setting..." : "Set default"}
    </button>
  );
}
