// user.api.ts
import { api } from "./client";
import type { User } from "@/lib/types/user";

export const UserAPI = {
  me() {
    return api<User>("/users/me");
  },

  updateMe(data: Partial<User>) {
    return api<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteMe() {
    return api<void>("/users/me", {
      method: "DELETE",
    });
  },
};
