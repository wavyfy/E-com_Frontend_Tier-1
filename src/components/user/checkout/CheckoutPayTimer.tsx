// CheckoutPayTimer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

const PAYMENT_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function CheckoutPayTimer({
  paymentInitiatedAt,
}: {
  paymentInitiatedAt?: string | null;
}) {
  if (!paymentInitiatedAt) return null;

  return (
    <TimerInner
      key={paymentInitiatedAt} // forces clean reset
      paymentInitiatedAt={paymentInitiatedAt}
    />
  );
}

function TimerInner({ paymentInitiatedAt }: { paymentInitiatedAt: string }) {
  const expiresAt = useMemo(
    () => new Date(paymentInitiatedAt).getTime() + PAYMENT_TTL_MS,
    [paymentInitiatedAt],
  );

  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(expiresAt - Date.now(), 0),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(Math.max(expiresAt - Date.now(), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (remainingMs <= 0) {
    return (
      <p className="text-sm text-red-600">
        Payment session expired. Please retry.
      </p>
    );
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <p className="text-sm text-yellow-700">
      Payment expires in <strong>{formatted}</strong>
    </p>
  );
}
