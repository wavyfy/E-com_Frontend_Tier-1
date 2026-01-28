import { fetchAddresses } from "@/lib/api/server/address.server";
import AddressList from "@/components/user/address/AddressList";

export default async function AddressesPage() {
  const addresses = await fetchAddresses();
  return <AddressList addresses={addresses} />;
}
