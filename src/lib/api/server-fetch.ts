import { cookies, headers } from "next/headers";
import { ApiError } from "./api-error";

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

  // ✅ MUST await in your Next version
  const cookieStore = await cookies();
  const reqHeaders = await headers();

  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const authHeader = reqHeaders.get("authorization");

  // 🔍 DEBUG (THIS is what matters)
  console.log("🟨 serverFetch allCookies:", allCookies);
  console.log("🟨 serverFetch cookieHeader:", cookieHeader);

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...(authHeader ? { authorization: authHeader } : {}),
      "Content-Type": "application/json",
    },
    cache: "no-store", // credentials is irrelevant for SSR
  });

  let data: unknown = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    let message = "Request failed";

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      message = (data as { message: string }).message;
    }

    throw new ApiError({
      type: res.status === 401 || res.status === 403 ? "AUTH" : "UNKNOWN",
      status: res.status,
      message,
      details: data,
    });
  }

  return data as T;
}
