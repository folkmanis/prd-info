import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';

@Injectable({
  providedIn: 'root'
})
export class ReproJobEditGuard implements CanDeactivate<ReproJobEditComponent> {

  constructor(
    private dialog: ConfirmationDialogService,
  ) { }

  canDeactivate(
    component: ReproJobEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const { saved, form: { pristine }, uploadRef } = component;

    if (saved || pristine && !uploadRef) return true;

    return this.dialog.discardChanges().pipe(
      tap(resp => resp && uploadRef?.cancel()),
    );
  }

}
