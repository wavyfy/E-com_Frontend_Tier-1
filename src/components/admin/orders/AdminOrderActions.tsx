export default function AdminOrderActions({
  updateStatus,
}: {
  updateStatus: (formData: FormData) => void;
}) {
  return (
    <section>
      <h3 className="font-medium mb-2">Admin Actions</h3>

      <form action={updateStatus} className="flex gap-3">
        <button name="status" value="FULFILLED">
          Mark FULFILLED
        </button>
        <button name="status" value="CANCELLED">
          Cancel Order
        </button>
      </form>
    </section>
  );
}
