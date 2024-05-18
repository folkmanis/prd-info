import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { Thread } from '../interfaces';
import { GmailService } from './gmail.service';

const NOT_FOUND_MESSAGE = 'Ieraksts nav atrasts';

export const resolveThread: ResolveFn<Thread> = async (route) => {

  const id = route.paramMap.get('id');

  const dialog = inject(ConfirmationDialogService);
  const router = inject(Router);

  try {
    const thread = await firstValueFrom(inject(GmailService).thread(id));
    return thread;
  } catch (error) {
    router.navigate(['jobs', 'gmail']);
    dialog.confirmDataError(NOT_FOUND_MESSAGE);
  }
};
