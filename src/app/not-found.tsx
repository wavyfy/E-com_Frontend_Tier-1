import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you’re looking for doesn’t exist or was moved."
      action={
        <Link href="/">
          <Button>Go to home</Button>
        </Link>
      }
    />
  );
}
