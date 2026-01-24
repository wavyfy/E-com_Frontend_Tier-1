import { api } from "./client";
import type { PaymentInitiateResponse } from "@/lib/types/payment";

export const PaymentAPI = {
  initiate(orderId: string) {
    return api<PaymentInitiateResponse>(`/payments/${orderId}/initiate`, {
      method: "POST",
    });
  },
};
