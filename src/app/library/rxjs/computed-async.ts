import { assertInInjectionContext, effect, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { assertPromise } from '../assert-utils';

export interface ComputedAsyncOptions<T> {
  initialValue?: T;
}

export function promiseToSignal<T>(
  asyncValue: Promise<T>,
  options?: ComputedAsyncOptions<T>,
): Signal<typeof options extends ComputedAsyncOptions<T> ? ((typeof options)['initialValue'] extends T ? T : T | undefined) : T | undefined> {
  return promiseToWritableSignal(asyncValue, options).asReadonly();
}

export function promiseToWritableSignal<T>(
  asyncValue: Promise<T>,
  options?: ComputedAsyncOptions<T>,
): WritableSignal<typeof options extends ComputedAsyncOptions<T> ? ((typeof options)['initialValue'] extends T ? T : T | undefined) : T | undefined> {
  assertInInjectionContext(promiseToSignal);
  assertPromise(asyncValue);

  const sourceValue = signal<T | undefined>(options?.initialValue ?? undefined);

  effect(async () => {
    const result = await asyncValue;
    untracked(() => sourceValue.set(result));
  });

  return sourceValue;
}

export function computedAsync<T>(
  computation: () => Promise<T>,
  options?: ComputedAsyncOptions<T>,
): Signal<typeof options extends ComputedAsyncOptions<T> ? ((typeof options)['initialValue'] extends T ? T : T | undefined) : T | undefined> {
  const asyncValue = computation();
  return promiseToSignal(asyncValue, options);
}
