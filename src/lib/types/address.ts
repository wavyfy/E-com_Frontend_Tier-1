// src/lib/api/address.types.ts
export interface Address {
  _id: string;
  name: string;
  phone: string;
  line: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type AddressInput = {
  name: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
