export function assertNotNull<T>(value: T | null | undefined, message = 'Value not defined'): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

export function notNullOrThrow<T>(value: T | null | undefined, message = 'Value not defined'): T {
  assertNotNull(value, message);
  return value;
}

export function notNullOrDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return value === null || value === undefined ? defaultValue : value;
}
