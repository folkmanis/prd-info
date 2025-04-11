export function assertPromise<T>(value: any, message = 'Promise required'): asserts value is Promise<T> {
  if (!value || typeof value.then !== 'function') {
    throw new Error(message);
  }
}
