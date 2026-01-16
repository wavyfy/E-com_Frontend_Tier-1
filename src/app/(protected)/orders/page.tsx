"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderAPI } from "@/lib/api/order.api";
import type { Order } from "@/lib/api/order.api";
import { ApiError } from "@/lib/api/api-error";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = 10;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await OrderAPI.list(page, limit);
        if (active) {
          setOrders(res.items);
          setError(null);
        }
      } catch (err) {
        if (!active) return;

        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unexpected error occurred.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [page]);

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="p-4">No orders yet.</p>;

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Your Orders</h1>

      <ul className="divide-y border rounded">
        {orders.map((order) => (
          <li
            key={order._id}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/orders/${order._id}`)}
          >
            <div>
              <p className="font-medium">Order #{order._id.slice(-6)}</p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
            </div>

            <div className="font-semibold">₹{order.totalAmount}</div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between pt-2">
        <button
          disabled={page === 1}
          onClick={() => router.push(`/orders?page=${page - 1}`)}
          className="underline disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={orders.length < limit}
          onClick={() => router.push(`/orders?page=${page + 1}`)}
          className="underline disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
