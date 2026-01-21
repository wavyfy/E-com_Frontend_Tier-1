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

  // ✅ request-bound cookies
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let res: Response;

  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",

        // allow callers to add headers
        ...(options.headers ?? {}),

        // 🔴 Cookie MUST be capitalized and applied last
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
    const status = res.status;
    const type = classifyStatus(status);

    // 🔴 CRITICAL: SSR must not crash on expected auth failure
    if (type === "AUTH") {
      throw new ApiError({
        type: "AUTH",
        status,
        message: "Authentication required",
      });
    }

    throw new ApiError({
      type,
      status,
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
