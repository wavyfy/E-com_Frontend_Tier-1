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

  /* ✅ cookies() IS async in your environment */
  const cookieStore = await cookies();

  const cookieHeader = Array.from(cookieStore)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  console.log("SSR COOKIES:", Array.from(cookieStore));
  let res: Response;

  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        "Content-Type": "application/json",
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
    const message =
      isObject(data) && typeof data.message === "string"
        ? data.message
        : "Request failed";

    const code =
      isObject(data) && typeof data.code === "string" ? data.code : undefined;

    const requestId =
      isObject(data) && typeof data.requestId === "string"
        ? data.requestId
        : undefined;

    const details = isObject(data) ? data.details : undefined;

    throw new ApiError({
      type: classifyStatus(res.status),
      status: res.status,
      message,
      code,
      requestId,
      details,
    });
  }

  return data as T;
}
