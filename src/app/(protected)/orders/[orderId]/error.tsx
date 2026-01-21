"use client";

import { useEffect } from "react";

export default function OrderError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // ✅ THIS runs in prod
    console.error("ORDER PAGE ERROR DIGEST:", error.digest);
    console.error("FULL ERROR:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-gray-600">
        Please refresh or try again later.
      </p>
    </div>
  );
}
