import { assertNumber } from 'src/app/library';

export function parseJobId(value: unknown): number | null {
  const numberValue = parseFloat(value as any) || Number(value);
  if (Number.isInteger(numberValue)) {
    return numberValue;
  } else {
    return null;
  }
}

export function parseJobIdRequired(value: unknown): number {
  const numberValue = parseJobId(value);
  assertNumber(numberValue);
  return numberValue;
}
