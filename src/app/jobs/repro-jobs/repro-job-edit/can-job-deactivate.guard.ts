import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';

export const canJobDeactivate: CanDeactivateFn<ReproJobEditComponent> = async (component) => {
  const dialog = inject(ConfirmationDialogService);

  const uploadRef = component.uploadRef;
  if (uploadRef && uploadRef.waiting && (await dialog.discardChanges())) {
    uploadRef.cancel();
    return true;
  }

  if (component.form.pristine || component.changes() === null) {
    return true;
  }

  return dialog.discardChanges();
};
