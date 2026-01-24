import { cookies, headers } from "next/headers";
import { ApiError } from "@/lib/api/api-error";

/* ---------- helpers ---------- */
function isErrorResponse(v: unknown): v is { message?: string } {
  return typeof v === "object" && v !== null;
}
/* ----------------------------- */

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new ApiError({
      type: "UNKNOWN",
      message: "API base URL not configured",
    });
  }

  /* ---------- build absolute URL for SSR ---------- */
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");

  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Cannot resolve request host");
  }

  const url = base.startsWith("/")
    ? `${proto}://${host}${base}${path}`
    : `${base}${path}`;
  /* ------------------------------------------------ */

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* ignore empty body */
  }

  if (!res.ok) {
    const message =
      isErrorResponse(data) && typeof data.message === "string"
        ? data.message
        : "Request failed";

    throw new ApiError({
      type: res.status === 401 || res.status === 403 ? "AUTH" : "UNKNOWN",
      status: res.status,
      message,
      details: data,
    });
  }

  return data as T;
}
