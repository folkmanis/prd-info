export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}

export function assertPromise<T>(value: unknown, message = 'Promise required'): asserts value is Promise<T> {
  if (!isPromise(value)) {
    throw new Error(message);
  }
}
