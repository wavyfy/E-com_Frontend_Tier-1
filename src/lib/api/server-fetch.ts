// src/lib/api/server-fetch.ts
import { cookies } from "next/headers";
import { ApiError } from "./api-error";
import type { ApiErrorType } from "../types/error";

function classifyStatus(status: number): ApiErrorType {
  if (status === 401 || status === 403) return "AUTH";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMIT";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

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

  // ✅ request-bound cookies (SSR-safe)
  const cookieStore = await cookies();
  const cookieHeader = Array.from(cookieStore)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  let res: Response;

  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError({
      type: "NETWORK",
      message: "Unable to reach API server",
    });
  }

  if (res.status === 204) {
    return null as T;
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const type = classifyStatus(res.status);

    // 🔴 SSR RULE: never crash render on auth failure
    if (type === "AUTH") {
      throw new ApiError({
        type: "AUTH",
        status: res.status,
        message: "Authentication required",
      });
    }

    throw new ApiError({
      type,
      status: res.status,
      message:
        isObject(data) && typeof data.message === "string"
          ? data.message
          : "Request failed",
      code:
        isObject(data) && typeof data.code === "string" ? data.code : undefined,
      requestId:
        isObject(data) && typeof data.requestId === "string"
          ? data.requestId
          : undefined,
      details: isObject(data) ? data.details : undefined,
    });
  }

  return data as T;
}
