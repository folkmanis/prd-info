import { assertInInjectionContext, effect, signal, Signal, untracked, WritableSignal } from '@angular/core';

export interface ComputedAsyncOptions<T> {
  initialValue?: T;
}

export function promiseToSignal<T>(asyncValue: Promise<T>, options?: ComputedAsyncOptions<T>): Signal<T> {
  return promiseToWritableSignal(asyncValue, options).asReadonly();
}

export function promiseToWritableSignal<T>(asyncValue: Promise<T>, options?: ComputedAsyncOptions<T>): WritableSignal<T> {
  assertInInjectionContext(promiseToSignal);
  assertPromise(asyncValue);

  const sourceValue = signal<T | undefined>(options?.initialValue ?? undefined);

  effect(async () => {
    const result = await asyncValue;
    untracked(() => sourceValue.set(result));
  });

  return sourceValue;
}

export function computedAsync<T>(computation: () => Promise<T>, options?: ComputedAsyncOptions<T>): Signal<T> {
  const asyncValue = computation();
  return promiseToSignal(asyncValue);
}

function assertPromise<T>(value: any): asserts value is Promise<T> {
  if (!value || typeof value.then !== 'function') {
    throw new Error('Promise required');
  }
}
