// src/lib/api/_debug-server-fetch.ts
export async function debugServerFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`DEBUG_FETCH_FAILED_${res.status}`);
  }

  return res.json();
}
