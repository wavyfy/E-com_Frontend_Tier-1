// src/lib/api/payment.api.ts
import { api } from "./client";

export const PaymentAPI = {
  initiate(orderId: string) {
    return api<{
      razorpayOrderId: string;
      amount: number;
      currency: string;
      key: string;
      attempt: number;
      maxRetries: number;
    }>(`/payments/${orderId}/initiate`, {
      method: "POST",
    });
  },
};
