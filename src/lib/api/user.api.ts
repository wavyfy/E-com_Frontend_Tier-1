import { api } from "./client";
import type { User } from "../types/user";

export const UserAPI = {
  me(accessToken: string) {
    return api<User>("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
