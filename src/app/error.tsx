"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error(error);
  return <h1>Something went wrong.</h1>;
}
