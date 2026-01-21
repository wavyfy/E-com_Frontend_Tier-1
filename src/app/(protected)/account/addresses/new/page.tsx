// app/account/addresses/new/page.tsx
import NewAddressClient from "@/components/address/NewAddressClient";

export default async function NewAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;

  return <NewAddressClient returnTo={returnTo} />;
}
