// app/account/addresses/page.tsx
import { fetchAddresses } from "@/lib/api/address.server";
import Link from "next/link";
import SetDefaultButton from "@/components/address/SetDefaultButton";
import DeleteAddressButton from "@/components/address/DeleteAddressButton";
import AddressLimitNotice from "@/components/address/AddressLimitNotice";

export default async function AddressesPage() {
  const addresses = await fetchAddresses();

  if (!addresses.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <p className="text-sm text-gray-600">No addresses yet.</p>
        <Link
          href="/account/addresses/new"
          className="inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Add address
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">My Addresses</h1>

        <AddressLimitNotice
          count={addresses.length}
          addHref="/account/addresses/new"
        />
      </div>

      <ul className="space-y-3">
        {addresses.map((a) => (
          <li
            key={a._id}
            className="flex items-start justify-between rounded-md border border-gray-200 p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {a.name}
                {a.isDefault && (
                  <span className="ml-2 text-xs text-green-600">Default</span>
                )}
              </p>
              <p className="text-sm text-gray-600">{a.line}</p>

              <p className="text-sm text-gray-600">
                {a.postalCode} {a.city}, {a.state}, {a.country}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {!a.isDefault && <SetDefaultButton address={a} />}

              <Link
                href={`/account/addresses/${a._id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <DeleteAddressButton address={a} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
