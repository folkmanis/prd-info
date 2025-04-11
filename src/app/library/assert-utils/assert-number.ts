export function assertNumber(value: any, message = 'Number required'): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(message);
  }
}

export function numberOrThrow(value: any, message = 'Number required'): number {
  assertNumber(value, message);
  return value;
}

export function numberOrDefault(value: any, defaultValue: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return defaultValue;
  }
  return value;
}

export function numberOrDefaultZero(value: any): number {
  return numberOrDefault(value, 0);
}
