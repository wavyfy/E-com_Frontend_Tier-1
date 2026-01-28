import Link from "next/link";
import type { Address } from "@/lib/types/address";
import SetDefaultButton from "./SetDefaultButton";
import AddressDeleteButton from "./AddressDeleteButton";

export default function AddressItem({ address }: { address: Address }) {
  return (
    <li className="flex items-start justify-between rounded-md border border-gray-200 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {address.name}
          {address.isDefault && (
            <span className="ml-2 text-xs text-green-600">Default</span>
          )}
        </p>

        <p className="text-sm text-gray-600">{address.line}</p>

        <p className="text-sm text-gray-600">
          {address.postalCode} {address.city}, {address.state},{" "}
          {address.country}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {!address.isDefault && <SetDefaultButton address={address} />}

        <Link
          href={`/account/addresses/${address._id}/edit`}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>

        <AddressDeleteButton address={address} />
      </div>
    </li>
  );
}
