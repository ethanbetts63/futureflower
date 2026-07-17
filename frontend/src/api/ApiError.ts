/**
 * The error every failing API call throws.
 *
 * Callers need the HTTP status (to tell "you are logged out" from "the network
 * blipped") and sometimes the raw body (for field-level validation errors), so
 * both are carried explicitly rather than bolted onto an Error with a cast.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/** Field-level errors as DRF returns them, e.g. `{ old_password: ["Wrong."] }`. */
export function fieldErrors(error: unknown): Record<string, string[]> | null {
  if (!(error instanceof ApiError)) return null;
  if (typeof error.data !== 'object' || error.data === null) return null;
  return error.data as Record<string, string[]>;
}

/**
 * Flatten field errors into one readable line, e.g.
 * `"email: Already taken; abn: Must be 11 digits"`. Empty string when the error
 * carries no field detail, so callers can fall back to the plain message.
 */
export function fieldErrorSummary(error: unknown, separator = '; '): string {
  const fields = fieldErrors(error);
  if (!fields) return '';

  return Object.entries(fields)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
    .join(separator);
}
