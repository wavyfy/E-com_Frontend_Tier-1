"use client";

interface Props {
  itemsCount: number;
  totalAmount: number;
  checkingOut: boolean;
  onCheckout: () => void;
}

export default function CartSummary({
  itemsCount,
  totalAmount,
  checkingOut,
  onCheckout,
}: Props) {
  return (
    <div className="border-t pt-4 flex justify-between items-center">
      <div>
        <span className="font-medium">Items: {itemsCount}</span>
        <br />
        <span className="font-semibold text-lg">Total: ₹{totalAmount}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={checkingOut}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {checkingOut ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  );
}
