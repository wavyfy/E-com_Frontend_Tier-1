export type Role = "user" | "admin" | null;

export type AuthContextType = {
  accessToken: string | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  invalidate: () => void;
};
