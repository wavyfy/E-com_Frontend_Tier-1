import Link from "next/link";
import type { Address } from "@/lib/types/address";
import AddressItem from "./AddressItem";
import AddressLimitNotice from "./AddressLimitNotice";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";

export default function AddressList({ addresses }: { addresses: Address[] }) {
  if (!addresses.length) {
    return (
      <EmptyState
        title="No addresses yet"
        description="Add an address to use during checkout."
        action={
          <Link href="/account/addresses/new">
            <Button>Add address</Button>
          </Link>
        }
      />
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
        {addresses.map((address) => (
          <AddressItem key={address._id} address={address} />
        ))}
      </ul>
    </div>
  );
}
