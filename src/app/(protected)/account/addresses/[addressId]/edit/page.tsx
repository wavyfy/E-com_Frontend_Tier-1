import { fetchAddressById } from "@/lib/api/server/address.server";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import EditAddress from "@/components/user/address/EditAddress";

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

  return <EditAddress address={address} />;
}
