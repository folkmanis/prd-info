import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canComponentDeactivate: CanDeactivateFn<CanComponentDeactivate> = (component) => {

  if (!component.canDeactivate) { return true; }

  const dialog = inject(ConfirmationDialogService);

  const cD = component.canDeactivate();

  return (typeof cD === 'boolean' ? of(cD) : from(cD))
    .pipe(
      switchMap(can => can ? of(can) : dialog.discardChanges())
    );

};
