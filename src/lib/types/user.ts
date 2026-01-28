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

  fullName?: string;
  phone?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  dob?: string;

  createdAt: string;
  updatedAt: string;
};

export type Gender = "male" | "female" | "other";

export type ProfileFormState = {
  fullName: string;
  phone: string;
  gender?: Gender;
  dob: string;
};
