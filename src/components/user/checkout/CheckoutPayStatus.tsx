import type { Order } from "@/lib/types/order";

export default function CheckoutPayStatus({
  order,
  message,
  attemptsLeft,
}: {
  order: Order;
  message: string | null;
  attemptsLeft: number;
}) {
  if (order.status !== "CREATED") return null;

  return (
    <>
      {message && <p className="text-red-600">{message}</p>}
      <p className="text-gray-600">
        {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
      </p>
    </>
  );
}
