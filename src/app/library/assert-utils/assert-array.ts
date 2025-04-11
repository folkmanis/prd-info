export function assertArray<T>(value: unknown, message = 'Value is not an array'): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
}
export function assertArrayOf<T>(value: unknown, message = 'Value is not an array', predicate: (item: unknown) => item is T): asserts value is T[] {
  assertArray(value, message);
  if (!value.every(predicate)) {
    throw new Error(message);
  }
}
export function assertArrayOfType<T>(value: unknown, message = 'Value is not an array', type: string): asserts value is T[] {
  assertArray(value, message);
  if (!value.every((item) => typeof item === type)) {
    throw new Error(message);
  }
}

export function assertArrayOfNotNull<T>(value: (T | null | undefined)[] | null | undefined, message = 'Some array elements not defined'): asserts value is T[] {
  assertArray(value);
  assertArrayOf(value, message, (item) => item !== null && item !== undefined);
}
