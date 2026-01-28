import AdminTable from "@/components/admin/common/AdminTable";
import type { AdminUser } from "@/lib/types/user";
import AdminUserRow from "./AdminUserRow";

export default function AdminUsersTable({ users }: { users: AdminUser[] }) {
  return (
    <AdminTable>
      <thead>
        <tr>
          <th align="left">User ID</th>
          <th align="left">Email</th>
          <th align="left">Name</th>
          <th align="left">Joined</th>
          <th align="left">Action</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <AdminUserRow key={u.id} user={u} />
        ))}
      </tbody>
    </AdminTable>
  );
}
