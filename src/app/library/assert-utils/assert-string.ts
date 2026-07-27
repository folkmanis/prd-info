export function assertString(value: unknown, message = 'String required'): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(message);
  }
}

export function stringOrThrow(value: unknown, message = 'String required'): string {
  assertString(value, message);
  return value;
}

export function stringOrDefault(value: unknown, defaultValue: string): string {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  return value;
}

export function stringOrEmpty(value: unknown): string {
  return stringOrDefault(value, '');
}
