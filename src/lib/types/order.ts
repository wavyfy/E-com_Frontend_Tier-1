export type Order = {
  _id: string;
  itemsCount: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  currency: string;
};