// app/(protected)/account/addresses/[addressId]/edit/page.tsx
import { fetchAddressById } from "@/lib/api/address.server";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import EditAddressClient from "@/components/address/EditAddressClient";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ addressId: string }>;
}) {
  const { addressId } = await params;

  let address;
  try {
    address = await fetchAddressById(addressId);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return <EditAddressClient address={address} />;
}
