export default function CheckoutAddressAction({
  submitting,
  disabled,
  onConfirm,
}: {
  submitting: boolean;
  disabled: boolean;
  onConfirm: () => void;
}) {
  return (
    <button
      onClick={onConfirm}
      disabled={submitting || disabled}
      className="w-full rounded-md bg-black py-2 text-white disabled:bg-gray-400"
    >
      {submitting ? "Saving…" : "Use this address"}
    </button>
  );
}
