/**
 * Narrow a caught value to something displayable.
 *
 * `catch` bindings are `unknown` — anything can be thrown. Typing them `any`
 * just to reach `.message` hides that, and reading `.message` off a non-Error
 * silently yields `undefined`, which is how "Failed to load" toasts end up with
 * no cause attached.
 */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return String(error);
}
