import { linkedSignal, Resource, resourceFromSnapshots, ResourceSnapshot } from '@angular/core';

export function nonNullResource<T>(
  input: Resource<T>,
  defaultValue: NoInfer<NonNullable<T>>,
): Resource<NonNullable<T>> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<NonNullable<T>>>({
    source: input.snapshot,
    computation: (snap) => {
      if (snap.status === 'error') {
        return snap;
      }
      if (snap.value === undefined || snap.value === null) {
        return { status: snap.status, value: defaultValue };
      }
      return { status: snap.status, value: snap.value };
    },
  });
  return resourceFromSnapshots(derived);
}
