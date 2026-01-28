export default function AdminTable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}
