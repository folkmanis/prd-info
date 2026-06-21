import { pickBy } from 'lodash-es';

type RequiredNonNullable<T> = {
  [K in keyof T]-?: T[K] extends null | undefined ? never : NonNullable<T[K]>;
};
export function pickNotNull<T extends { [K in keyof T]?: T[K] }>(obj: T): RequiredNonNullable<T> {
  return pickBy(obj, (val) => val !== undefined && val !== null) as RequiredNonNullable<T>;
}

export function pickNotNullOrEmpty<T extends { [K in keyof T]?: T[K] }>(obj: T): RequiredNonNullable<T> {
  return pickBy(
    obj,
    (val) => val !== undefined && val !== null && (typeof val !== 'string' || val.length > 0),
  ) as RequiredNonNullable<T>;
}
