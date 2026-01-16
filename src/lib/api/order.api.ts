import { api } from "./client";

/* ---------- Types ---------- */

export type OrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "FULFILLED"
  | "CANCELLED";

export type OrderStatusHistory = {
  from: OrderStatus;
  to: OrderStatus;
  changedBy: string;
  changedAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  itemsCount: number;
  totalAmount: number;
  status: OrderStatus;
  currency: string;
  paymentAttempts: number;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  paymentInitiatedAt?: string | null;
};

export type PaginatedOrders = {
  page: number;
  limit: number;
  items: Order[];
};

/* ---------- API ---------- */

export const OrderAPI = {
  /* ===== USER ===== */

  // Create order from cart → CREATED
  checkout() {
    return api<Order>("/orders/checkout", {
      method: "POST",
    });
  },

  // Get order by ID
  getById(orderId: string) {
    return api<Order>(`/orders/${orderId}`);
  },

  // User order history (PAID / FULFILLED)
  list(page = 1, limit = 10) {
    return api<PaginatedOrders>(`/orders?page=${page}&limit=${limit}`);
  },

  // Reorder → rebuild cart
  reorder(orderId: string) {
    return api(`/orders/${orderId}/reorder`, {
      method: "POST",
    });
  },

  /* ===== ADMIN ===== */

  adminGetById(orderId: string) {
    return api<Order>(`/orders/admin/${orderId}`);
  },

  adminUpdateStatus(orderId: string, status: OrderStatus) {
    return api<Order>(`/orders/admin/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },
};
