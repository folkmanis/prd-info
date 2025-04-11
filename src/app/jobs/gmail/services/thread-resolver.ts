import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { Thread } from '../interfaces';
import { GmailService } from './gmail.service';
import { notNullOrThrow } from 'src/app/library';

const NOT_FOUND_MESSAGE = 'Ieraksts nav atrasts';

export const resolveThread: ResolveFn<Thread> = async (route) => {
  const dialog = inject(ConfirmationDialogService);

  try {
    const id = notNullOrThrow(route.paramMap.get('id'));
    const thread = await firstValueFrom(inject(GmailService).thread(id));
    return thread;
  } catch (error) {
    dialog.confirmDataError(NOT_FOUND_MESSAGE);
  }
  return new RedirectCommand(inject(Router).parseUrl('/jobs/gmail'));
};
