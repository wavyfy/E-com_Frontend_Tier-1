import { api } from "./client";
import type { Order } from "@/lib/types/order";

export const OrderAPI = {
  /* ================= USER ================= */

  // 1️⃣ Create / reuse draft order
  checkout(): Promise<Order> {
    return api<Order>("/orders/checkout", {
      method: "POST",
    });
  },

  // 2️⃣ Attach address by ID (address selection step)
  attachAddress(orderId: string, addressId: string) {
    return api<Order>(`/orders/${orderId}/address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId }),
    });
  },

  // 3️⃣ Fetch order (pay page polling etc.)
  getById(orderId: string): Promise<Order> {
    return api<Order>(`/orders/${orderId}`);
  },

  // 4️⃣ Reorder
  reorder(orderId: string) {
    return api(`/orders/${orderId}/reorder`, {
      method: "POST",
    });
  },
};
