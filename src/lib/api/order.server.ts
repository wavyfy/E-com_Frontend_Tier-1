import { serverFetch } from "./server-fetch";
import type {
  Order,
  OrderStatus,
  AdminOrderListResponse,
  AdminOrderDetail,
} from "../types/order";

/* ================= USER (SERVER) ================= */

// fetch single order (checkout / pay / address pages)
export function fetchOrderById(orderId: string): Promise<Order> {
  return serverFetch<Order>(`/orders/${orderId}`);
}

// list user orders (account page)
export function fetchOrders(
  page = 1,
  limit = 10,
): Promise<{ page: number; limit: number; items: Order[] }> {
  return serverFetch(`/orders?page=${page}&limit=${limit}`);
}

export function fetchLatestOrderWithAddress() {
  return serverFetch<Order | null>("/orders/latest-with-address");
}

/* ================= ADMIN ================= */

export function fetchAdminOrders(
  page = 1,
  limit = 10,
): Promise<AdminOrderListResponse> {
  return serverFetch<AdminOrderListResponse>(
    `/admin/orders?page=${page}&limit=${limit}`,
  );
}

export function fetchAdminOrderById(
  orderId: string,
): Promise<AdminOrderDetail> {
  return serverFetch<AdminOrderDetail>(`/admin/orders/${orderId}`);
}

export function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<AdminOrderDetail> {
  return serverFetch<AdminOrderDetail>(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
