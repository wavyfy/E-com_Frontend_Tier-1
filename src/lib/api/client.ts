// src/lib/api/client.ts
import { ApiError, ApiErrorType } from "./api-error";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function classifyError(status: number): ApiErrorType {
  if (status === 401 || status === 403) return "AUTH";
  if (status === 422) return "VALIDATION";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMIT";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

async function parseError(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new ApiError({
      type: "UNKNOWN",
      message: "API base URL not configured",
    });
  }

  // ✅ FIX 1: robust auth endpoint detection
  const isAuthEndpoint = path.includes("/auth/");

  let res: Response;

  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError({
      type: "NETWORK",
      message: "Network error. Please check your connection.",
    });
  }

  if (res.status === 204) {
    return null as T;
  }

  const data = await parseError(res);

  if (res.ok) {
    return data as T;
  }

  // ---------- NO REFRESH CASE ----------
  if (res.status !== 401 || isAuthEndpoint) {
    throw new ApiError({
      type: classifyError(res.status),
      status: res.status,
      message: data?.message || "Request failed",
      code: data?.code,
      requestId: data?.requestId,
      details: data?.details,
    });
  }

  // ---------- REFRESH FLOW ----------
  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = fetch(`${base}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) {
          throw new ApiError({
            type: "AUTH",
            status: r.status,
            message: "Session expired",
            code: "AUTH_TOKEN_EXPIRED",
          });
        }
        const d = await r.json();
        setAccessToken(d.accessToken);
        return d.accessToken;
      })
      .finally(() => {
        isRefreshing = false;
      });
  }

  let newToken: string;

  try {
    newToken = await refreshPromise!;
  } catch (err) {
    setAccessToken(null);
    throw err instanceof ApiError
      ? err
      : new ApiError({
          type: "AUTH",
          message: "Session expired",
          code: "AUTH_TOKEN_EXPIRED",
        });
  }

  // ---------- RETRY ORIGINAL REQUEST ----------
  let retryRes: Response;

  try {
    retryRes = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...(options.headers || {}),
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError({
      type: "NETWORK",
      message: "Network error after retry",
    });
  }

  const retryData = await parseError(retryRes);

  if (!retryRes.ok) {
    throw new ApiError({
      type: classifyError(retryRes.status),
      status: retryRes.status,
      message: retryData?.message || "Request failed",
      code: retryData?.code,
      requestId: retryData?.requestId,
      details: retryData?.details,
    });
  }

  return retryData as T;
}
