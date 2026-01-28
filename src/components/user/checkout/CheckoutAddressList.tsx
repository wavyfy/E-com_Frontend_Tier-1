import type { Address } from "@/lib/types/address";

export default function CheckoutAddressList({
  addresses,
  selected,
  onSelect,
}: {
  addresses: Address[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {addresses.map((a) => (
        <label
          key={a._id}
          className="flex gap-3 rounded-md border p-4 cursor-pointer hover:border-gray-400"
        >
          <input
            type="radio"
            checked={selected === a._id}
            onChange={() => onSelect(a._id)}
          />

          <div className="text-sm">
            <p className="font-medium">
              {a.name}
              {a.isDefault && (
                <span className="ml-2 text-xs text-green-600">Default</span>
              )}
            </p>
            <p className="text-gray-600">
              {a.line}, {a.city}, {a.state}
            </p>
            <p className="text-gray-600">
              {a.postalCode}, {a.country}
            </p>
            <p className="text-gray-600">{a.phone}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
