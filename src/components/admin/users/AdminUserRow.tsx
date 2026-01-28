import Link from "next/link";
import type { AdminUser } from "@/lib/types/user";

export default function AdminUserRow({ user }: { user: AdminUser }) {
  return (
    <tr className="border-t">
      <td className="py-2 font-mono">{user.id}</td>
      <td>{user.email}</td>
      <td>{user.name ?? "—"}</td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <Link href={`/admin/users/${user.id}`} className="underline">
          View
        </Link>
      </td>
    </tr>
  );
}
