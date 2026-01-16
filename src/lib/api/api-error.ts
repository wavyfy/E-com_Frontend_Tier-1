export type ApiErrorType =
  | "AUTH"
  | "VALIDATION"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "SERVER"
  | "CONFLICT"
  | "NETWORK"
  | "UNKNOWN";

export class ApiError extends Error {
  readonly type: ApiErrorType;
  readonly status: number | null;
  readonly code?: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(params: {
    type: ApiErrorType;
    message: string;
    status?: number | null;
    code?: string;
    requestId?: string;
    details?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.type = params.type;
    this.status = params.status ?? null;
    this.code = params.code;
    this.requestId = params.requestId;
    this.details = params.details;
  }
}
