import { isSignal, Signal, signal } from '@angular/core';

export type FilterInput<T extends Record<string, any>> = Signal<T> | T | null | undefined;

export function toFilterSignal<T extends Record<string, any>>(filterSignal: FilterInput<T>, defaultFilter: Partial<T> = {}): Signal<Partial<T>> {
  return isSignal(filterSignal) ? filterSignal : signal(filterSignal ?? defaultFilter);
}
