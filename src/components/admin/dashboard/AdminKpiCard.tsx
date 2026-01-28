export default function AdminKpiCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border p-6 rounded space-y-1">
      <div className="text-sm opacity-60">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
