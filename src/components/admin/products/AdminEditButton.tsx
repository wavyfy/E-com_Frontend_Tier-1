"use client";

import Link from "next/link";

export function AdminEditButton({ productId }: { productId: string }) {
  return <Link href={`/admin/products/${productId}/edit`}>Edit</Link>;
}
