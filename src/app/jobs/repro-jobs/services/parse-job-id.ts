export function parseJobId(value: unknown): number | null {
  const isNumberValue = !isNaN(parseFloat(value as any)) && !isNaN(Number(value));
  return isNumberValue ? Number(value) : null;
}
