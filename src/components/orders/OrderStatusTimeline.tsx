type Props = {
  history: {
    from: string;
    to: string;
    changedBy: string;
    changedAt: string;
  }[];
};

export default function OrderStatusTimeline({ history }: Props) {
  if (!history.length) {
    return (
      <div className="text-sm text-gray-500">No status changes recorded.</div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Status Timeline</h3>

      <ul className="space-y-2">
        {history.map((h, i) => (
          <li key={i} className="border rounded p-3 text-sm">
            <div>
              <strong>{h.from}</strong> → <strong>{h.to}</strong>
            </div>
            <div className="text-gray-500">
              {new Date(h.changedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
