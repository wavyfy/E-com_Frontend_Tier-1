export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type PaginatedUsers = {
  page: number;
  limit: number;
  items: AdminUser[];
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};