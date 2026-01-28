import type { User } from "@/lib/types/user";

export default function UserProfileView({
  user,
  onEdit,
}: {
  user: User;
  onEdit: () => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.fullName ?? "—"}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone ?? "—"}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender ?? "—"}
        </p>
        <p>
          <strong>Date of birth:</strong>{" "}
          {user.dob
            ? new Date(user.dob).toLocaleDateString(undefined, {
                year: "numeric",
                day: "numeric",
                month: "long",
              })
            : "—"}
        </p>
      </div>

      <button onClick={onEdit}>Edit Profile</button>
    </>
  );
}
