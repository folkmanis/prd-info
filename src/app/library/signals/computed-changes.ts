import { computed, Signal, isSignal } from '@angular/core';
import { isEqual, pickBy } from 'lodash-es';

export function computedSignalChanges<T extends Record<string, unknown>>(
  current: Signal<T>,
  initial: Signal<unknown> | unknown,
): Signal<Partial<T> | null> {
  return computed(() => {
    const value = current();
    const initialValue = isSignal(initial) ? initial() : initial;
    return computedChanges(value, initialValue);
  });
}

export function computedChanges<T extends Record<string, unknown>>(
  current: T,
  initialValue: unknown,
): Partial<T> | null {
  const diff = pickBy(
    current,
    (v, key) => v !== null && !isEqual(v, initialValue?.[key as keyof typeof initialValue]),
  ) as Partial<T>;
  return Object.keys(diff).length ? diff : null;
}
