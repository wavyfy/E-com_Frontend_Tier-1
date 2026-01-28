import type { LoadingStateProps } from "@/lib/types/common";

export default function LoadingState({
  message = "Loading...",
  className = "p-4",
}: LoadingStateProps) {
  return <p className={className}>{message}</p>;
}
