import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { tap } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';

export const canJobDeactivate: CanDeactivateFn<ReproJobEditComponent> = (component) => {

  const dialog = inject(ConfirmationDialogService);

  const { saved$, form: { pristine }, uploadRef } = component;

  if (saved$.value || pristine && !uploadRef) {
    return true;
  } else {
    return dialog.discardChanges().pipe(
      tap(resp => resp && uploadRef?.cancel()),
    );
  }

};
