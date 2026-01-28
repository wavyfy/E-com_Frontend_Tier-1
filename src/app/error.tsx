"use client";

import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error(error);

  return (
    <EmptyState
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
      action={
        <Button onClick={() => window.location.reload()}>Reload page</Button>
      }
    />
  );
}
