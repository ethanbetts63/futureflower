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

export function fieldErrors(error: unknown): Record<string, string[]> | null {
  if (!(error instanceof ApiError)) return null;
  if (typeof error.data !== 'object' || error.data === null) return null;
  return error.data as Record<string, string[]>;
}

export function fieldErrorSummary(error: unknown, separator = '; '): string {
  const fields = fieldErrors(error);
  if (!fields) return '';

  return Object.entries(fields)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
    .join(separator);
}
