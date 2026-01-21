// src/lib/api/address.server.ts
import { serverFetch } from "./server-fetch";
import type { Address } from "../types/address";

/* ================= LIST ================= */

export async function fetchAddresses(): Promise<Address[]> {
  return serverFetch<Address[]>("/addresses");
}

/* ================= GET ONE ================= */

export async function fetchAddressById(addressId: string): Promise<Address> {
  return serverFetch<Address>(`/addresses/${addressId}`);
}

/* ================= GET DEFAULT ================= */

export async function fetchDefaultAddress(): Promise<Address | null> {
  return serverFetch<Address | null>("/addresses/default");
}
