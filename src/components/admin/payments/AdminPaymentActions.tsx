import { adminUpdatePaymentStatus } from "@/lib/api/server/payment.server";

export default function AdminPaymentActions({
  paymentId,
}: {
  paymentId: string;
}) {
  async function markStatus(formData: FormData) {
    "use server";

    const status = formData.get("status");

    if (status !== "SUCCESS" && status !== "FAILED") return;

    await adminUpdatePaymentStatus(paymentId, status);
  }

  return (
    <section>
      <h3 className="font-medium mb-2">Manual Reconciliation</h3>

      <form action={markStatus} className="flex gap-4">
        <button name="status" value="SUCCESS">
          Mark SUCCESS
        </button>
        <button name="status" value="FAILED">
          Mark FAILED
        </button>
      </form>
    </section>
  );
}
