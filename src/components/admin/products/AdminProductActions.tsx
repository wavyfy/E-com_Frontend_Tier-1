"use client";

import { AdminEditButton } from "./AdminEditButton";
import { AdminDeleteButton } from "./AdminDeleteButton";

export default function AdminProductActions({ productId }: { productId: string }) {
  return (
    <>
      <AdminEditButton productId={productId} />
      <AdminDeleteButton productId={productId} />
    </>
  );
}
