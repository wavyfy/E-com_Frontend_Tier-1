import Link from "next/link";
import type { PaginationProps } from "@/lib/types/common";

export function Pagination({
  currentPage,
  basePath,
  hasNextPage = true,
}: PaginationProps) {
  return (
    <div
      style={{
        marginTop: 32,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {currentPage > 1 ? (
        <Link href={`${basePath}?page=${currentPage - 1}`}>Prev</Link>
      ) : (
        <span />
      )}

      {hasNextPage ? (
        <Link href={`${basePath}?page=${currentPage + 1}`}>Next</Link>
      ) : (
        <span />
      )}
    </div>
  );
}
