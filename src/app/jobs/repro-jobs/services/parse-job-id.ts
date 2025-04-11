import { assertNumber } from 'src/app/library';

export function parseJobId(value: unknown): number {
  const numberValue = parseFloat(value as any) || Number(value);
  assertNumber(numberValue, 'Job ID must be a number');
  return numberValue;
}
