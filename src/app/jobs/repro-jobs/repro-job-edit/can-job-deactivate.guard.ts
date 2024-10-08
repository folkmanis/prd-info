import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';

export const canJobDeactivate: CanDeactivateFn<ReproJobEditComponent> = async (component) => {
  const { saved, form, update } = component;
  const uploadRef = component.uploadRef();

  if (saved() || ((update() == undefined || form.pristine) && !uploadRef)) {
    return true;
  } else {
    const resp = await inject(ConfirmationDialogService).discardChanges();
    resp && uploadRef?.cancel();
    return resp;
  }
};
