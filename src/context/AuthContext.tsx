// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthAPI } from "@/lib/api/auth.api";
import { setAccessToken as setClientAccessToken } from "@/lib/api/client";
import { ApiError } from "@/lib/api/api-error";

type Role = "user" | "admin" | null;

type AuthContextType = {
  accessToken: string | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getRoleFromToken(token: string): Role {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!accessToken;

  function handleAuthError(err: unknown): never {
    if (
      err instanceof ApiError &&
      typeof err.code === "string" &&
      ["AUTH_REQUIRED", "AUTH_INVALID_TOKEN", "AUTH_TOKEN_EXPIRED"].includes(
        err.code
      )
    ) {
      setAccessToken(null);
      setRole(null);
      setClientAccessToken(null);
    }
    throw err;
  }

  // 🔄 Restore session (AUTH ONLY)
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const { accessToken } = await AuthAPI.refresh();
        if (cancelled) return;

        setAccessToken(accessToken);
        setRole(getRoleFromToken(accessToken));
        setClientAccessToken(accessToken);
      } catch {
        if (cancelled) return;
        setAccessToken(null);
        setRole(null);
        setClientAccessToken(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      const { accessToken } = await AuthAPI.login(email, password);
      setAccessToken(accessToken);
      setRole(getRoleFromToken(accessToken));
      setClientAccessToken(accessToken);
    } catch (err) {
      handleAuthError(err);
    }
  }

  async function register(email: string, password: string) {
    try {
      const { accessToken } = await AuthAPI.register(email, password);
      setAccessToken(accessToken);
      setRole(getRoleFromToken(accessToken));
      setClientAccessToken(accessToken);
    } catch (err) {
      handleAuthError(err);
    }
  }

  async function logout() {
    try {
      await AuthAPI.logout();
    } finally {
      setAccessToken(null);
      setRole(null);
      setClientAccessToken(null);
      window.location.href = "/login";
    }
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
