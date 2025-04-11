export function assertString(value: any, message = 'String required'): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(message);
  }
}

export function stringOrThrow(value: any, message = 'String required'): string {
  assertString(value, message);
  return value;
}

export function stringOrDefault(value: any, defaultValue: string): string {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  return value;
}

export function stringOrEmpty(value: any): string {
  return stringOrDefault(value, '');
}
