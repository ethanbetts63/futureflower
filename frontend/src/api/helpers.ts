import { ApiError } from './ApiError';

function messageFrom(data: unknown): string {
  if (typeof data !== 'object' || data === null) return 'An unknown API error occurred.';

  const body = data as Record<string, unknown>;
  if (typeof body.detail === 'string') return body.detail;

  const firstKey = Object.keys(body)[0];
  if (firstKey === undefined) return 'An unknown API error occurred.';

  const errors = body[firstKey];
  if (Array.isArray(errors) && typeof errors[0] === 'string') return errors[0];
  if (typeof errors === 'string') return errors;

  return 'An unknown API error occurred.';
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(messageFrom(data), response.status, data);
  }
  return data as T;
}

export { handleResponse };
