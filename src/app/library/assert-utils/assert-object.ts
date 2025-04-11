export type NullableType<T> = { [K in keyof T]: T[K] | null };
export type NonNullable<T> = { [K in keyof T]: Exclude<T[K], null | undefined> };

export function assertNoNullProperties<T>(obj: NullableType<T>): asserts obj is NonNullable<T> {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null) {
      throw new Error(`Property ${key} is null`);
    }
  });
}
