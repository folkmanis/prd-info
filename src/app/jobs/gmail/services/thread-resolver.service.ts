import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { GmailService } from './gmail.service';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { Thread } from '../interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';

const NOT_FOUND_MESSAGE = 'Ieraksts nav atrasts';

@Injectable({
  providedIn: 'any'
})
export class ThreadResolverService  {

  constructor(
    private readonly gmail: GmailService,
    private readonly dialog: ConfirmationDialogService,
    private readonly router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Thread | Observable<Thread> | Promise<Thread> {
    const id = route.paramMap.get('id');

    return this.gmail.thread(id).pipe(
      catchError(err => {
        this.router.navigate(['jobs', 'gmail']);
        return this.dialog.confirmDataError(NOT_FOUND_MESSAGE);
      })
    );
  }
}
