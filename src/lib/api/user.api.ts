import { api } from "./client";

export const UserAPI = {
  me(accessToken: string) {
    return api<{ id: string; role: string }>("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
