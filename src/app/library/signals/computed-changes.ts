import { computed, Signal, isSignal } from '@angular/core';
import { isEqual, pickBy } from 'lodash-es';

export function pickChanges<T extends object>(
  current: T,
  initialValue: unknown,
  { includeNull }: { includeNull?: boolean } = {},
): Partial<T> {
  return pickBy(
    current,
    (v, key) => (v !== null || includeNull) && !isEqual(v, initialValue?.[key as keyof typeof initialValue]),
  ) as Partial<T>;
}

export function computedSignalChanges<T extends object>(
  current: Signal<T>,
  initial: Signal<unknown> | unknown,
  params: { includeNull?: boolean } = {},
): Signal<Partial<T> | null> {
  return computed(() => {
    const value = current();
    const initialValue = isSignal(initial) ? initial() : initial;
    return computedChanges(value, initialValue, params);
  });
}

export function computedChanges<T extends object>(
  current: T,
  initialValue: unknown,
  params: { includeNull?: boolean } = {},
): Partial<T> | null {
  const diff = pickChanges(current, initialValue, params);
  return Object.keys(diff).length ? diff : null;
}
