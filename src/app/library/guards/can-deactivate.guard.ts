import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private dialog: ConfirmationDialogService,
  ) { }

  canDeactivate(component: CanComponentDeactivate) {
    if (!component.canDeactivate) { return true; }
    const cD = component.canDeactivate();
    return (typeof cD === 'boolean' ? of(cD) : from(cD))
      .pipe(
        switchMap(can => can ? of(can) : this.dialog.discardChanges())
      );
  }

}
