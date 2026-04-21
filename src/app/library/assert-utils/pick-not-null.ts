import { pickBy } from 'lodash-es';

export function pickNotNull<T extends object>(obj: T): Partial<T> {
  return pickBy(obj, (val) => val !== undefined && val !== null);
}
