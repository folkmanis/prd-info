import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';
import { tap } from 'rxjs';

export const canJobDeactivate: CanDeactivateFn<ReproJobEditComponent> = (component) => {
  const dialog = inject(ConfirmationDialogService);

  if (component.uploadRef?.waiting) {
    return dialog.discardChanges().pipe(tap((resp) => resp && component.uploadRef?.cancel()));
  }

  if (component.form.pristine || component.changes() === null) {
    return true;
  }

  return dialog.discardChanges();
};
