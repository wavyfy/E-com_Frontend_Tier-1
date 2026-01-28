"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressAPI } from "@/lib/api/client/address.api";
import type { Address } from "@/lib/types/address";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AddressDeleteButton({ address }: { address: Address }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (deleting) return;

    try {
      setDeleting(true);
      await AddressAPI.remove(address._id);
      router.refresh();
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        Delete
      </button>

      <ConfirmModal
        open={open}
        title="Delete address?"
        description="This action cannot be undone."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
