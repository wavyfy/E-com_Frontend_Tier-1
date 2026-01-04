import { api } from "./client";

export type Order = {
  _id: string;
  itemsCount: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  currency: string;
};

export const OrderAPI = {
  checkout() {
    return api<Order>("/orders/checkout", {
      method: "POST",
    });
  },
  getLatestPending() {
  return api<Order | null>("/orders/latest/pending");
}
};
