export function assertNumber(value: unknown, message = 'Number required'): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(message);
  }
}

export function numberOrThrow(value: unknown, message = 'Number required'): number {
  assertNumber(value, message);
  return value;
}

export function numberOrDefault(value: unknown, defaultValue: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return defaultValue;
  }
  return value;
}

export function numberOrDefaultZero(value: unknown): number {
  return numberOrDefault(value, 0);
}
