"use client";

import Link from "next/link";

export const MAX_ADDRESSES = 5;

export default function AddressLimitNotice({
  count,
  addHref,
}: {
  count: number;
  addHref: string;
}) {
  if (count < MAX_ADDRESSES) {
    return (
      <Link
        href={addHref}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        + Add new address
      </Link>
    );
  }

  return (
    <p className="text-sm text-red-500">
      You can save up to {MAX_ADDRESSES} addresses. Delete one to add another.
    </p>
  );
}
