export default function CheckoutPayAction({
  isCreated,
  locked,
  onPay,
}: {
  isCreated: boolean;
  locked: boolean;
  onPay: () => void;
}) {
  if (!isCreated) return null;

  return (
    <button
      onClick={onPay}
      disabled={locked}
      className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-400"
    >
      {locked ? "Payment in progress…" : "Pay Now"}
    </button>
  );
}
