import { api } from "./client";

export const AuthAPI = {
  login(email: string, password: string) {
    return api<{ accessToken: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },

  register(email: string, password: string) {
    return api<{ accessToken: string }>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },

  refresh() {
    return api<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
    });
  },

  logout() {
    return api<void>("/auth/logout", {
      method: "POST",
    });
  },
};
