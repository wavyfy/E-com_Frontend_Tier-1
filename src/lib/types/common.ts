export type PaginationProps = {
  currentPage: number;
  basePath: string;
  hasNextPage?: boolean;
};

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
