import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { Thread } from '../interfaces';
import { GmailService } from './gmail.service';

const NOT_FOUND_MESSAGE = 'Ieraksts nav atrasts';

export const resolveThread: ResolveFn<Thread> = (route) => {

  const id = route.paramMap.get('id');

  const dialog = inject(ConfirmationDialogService);
  const router = inject(Router);

  return inject(GmailService).thread(id).pipe(
    catchError(err => {
      router.navigate(['jobs', 'gmail']);
      return dialog.confirmDataError(NOT_FOUND_MESSAGE);
    })
  );
};
