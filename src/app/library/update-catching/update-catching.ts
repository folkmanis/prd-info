import { inject, isSignal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type MessageFn = (message: string) => void;
type UpdateFn = (messageFn: MessageFn) => Promise<void>;
type ErrorFn = (messageFn: MessageFn) => void;

export function updateCatching(
  busySignal?: WritableSignal<boolean>,
): (updateFn: UpdateFn, errorFn?: ErrorFn) => Promise<void> {
  const snack = inject(MatSnackBar);
  const messageFn: MessageFn = (message) => {
    snack.open(message, 'OK', { duration: 3000 });
  };
  const errorMessageFn: (message: unknown) => void = (message) => {
    console.error(message);
    snack.open(`Neizdevās ${message}`, 'OK');
  };

  return async (updateFn, errorFn) => {
    if (isSignal(busySignal)) {
      busySignal.set(true);
    }
    try {
      await updateFn(messageFn);
    } catch (error) {
      if (errorFn) {
        errorFn(errorMessageFn);
      } else {
        errorMessageFn(error);
      }
    }
    if (isSignal(busySignal)) {
      busySignal.set(false);
    }
  };
}
