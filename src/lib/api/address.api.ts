// src/lib/api/address.api.ts
import { api } from "./client";
import type { Address } from "../types/address";

export const AddressAPI = {
  /* ===== USER ===== */

  create(data: Partial<Address>) {
    return api<Address>("/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  update(addressId: string, data: Partial<Address>) {
    return api<Address>(`/addresses/${addressId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  remove(addressId: string) {
    return api<void>(`/addresses/${addressId}`, {
      method: "DELETE",
    });
  },

  setDefault(addressId: string) {
    return api<Address>(`/addresses/${addressId}/default`, {
      method: "PATCH",
    });
  },
};
