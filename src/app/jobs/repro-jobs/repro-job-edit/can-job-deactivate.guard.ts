import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';

export const canJobDeactivate: CanDeactivateFn<ReproJobEditComponent> = async (component) => {
  const uploadRef = component.uploadRef();
  if (uploadRef && uploadRef.waiting) {
    if (await inject(ConfirmationDialogService).discardChanges()) {
      component.uploadRef()?.cancel();
      return true;
    } else {
      return false;
    }
  }

  if (component.form.pristine || component.changes() === null) {
    return true;
  }

  return await inject(ConfirmationDialogService).discardChanges();
};
