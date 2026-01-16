import { cookies } from "next/headers";
import type { Order, PaginatedOrders } from "./order.api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/* 🔒 helper: serialize cookies correctly */
async function serializeCookies(): Promise<string> {
  const cookieStore = await cookies(); // ✅ MUST await

  return cookieStore
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");
}

/* ================= ADMIN (SERVER ONLY) ================= */

export async function fetchAdminOrders(
  page = 1,
  limit = 10
): Promise<PaginatedOrders> {
  const res = await fetch(
    `${API_URL}/orders/admin?page=${page}&limit=${limit}`,
    {
      headers: {
        Cookie: await serializeCookies(), // ✅ awaited
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin orders");
  }

  return res.json();
}

export async function fetchAdminOrderById(
  orderId: string
): Promise<Order> {
  const res = await fetch(
    `${API_URL}/orders/admin/${orderId}`,
    {
      headers: {
        Cookie: await serializeCookies(), // ✅ awaited
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin order");
  }

  return res.json();
}
