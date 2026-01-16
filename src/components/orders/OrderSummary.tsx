export default function OrderSummary({ order }: any) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold">Order Summary</h2>
      <p>Status: {order.status}</p>
      <p>
        Total: {order.totalAmount} {order.currency}
      </p>
      <p>Items: {order.itemsCount}</p>
    </div>
  );
}
