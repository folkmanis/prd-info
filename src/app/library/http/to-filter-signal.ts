import { isSignal, Signal, signal } from '@angular/core';

export type FilterInput<T extends Record<string, unknown> | undefined> = Signal<T> | T | undefined;

export function toFilterSignal<T>(filterSignal: Signal<T> | T): Signal<T> {
  return isSignal(filterSignal) ? filterSignal : signal(filterSignal);
}
