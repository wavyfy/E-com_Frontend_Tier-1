export default function AdminPaymentHistory({
  history,
}: {
  history: {
    from: string;
    to: string;
    changedBy: string;
    changedAt: string;
  }[];
}) {
  return (
    <section>
      <h3 className="font-medium mb-2">Status History</h3>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th align="left">From</th>
            <th align="left">To</th>
            <th align="left">By</th>
            <th align="left">At</th>
          </tr>
        </thead>

        <tbody>
          {history.map((h, i) => (
            <tr key={`${h.changedAt}-${i}`} className="border-t">
              <td>{h.from}</td>
              <td>{h.to}</td>
              <td className="font-mono">{h.changedBy}</td>
              <td>{new Date(h.changedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
