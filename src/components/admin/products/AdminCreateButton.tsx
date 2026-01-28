"use client";

import Link from "next/link";

export default function AdminCreateButton() {
  return (
    <Link href="/admin/products/new" className="underline text-sm font-medium">
      Create Product
    </Link>
  );
}
