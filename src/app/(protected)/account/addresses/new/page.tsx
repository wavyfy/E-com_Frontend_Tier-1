import AddAddress from "@/components/user/address/AddAddress";

export default async function NewAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  return <AddAddress returnTo={returnTo} />;
}
