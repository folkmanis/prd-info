import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { notNullOrThrow } from 'src/app/library';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { Thread } from '../interfaces';
import { GmailService } from './gmail.service';

const NOT_FOUND_MESSAGE = 'Ieraksts nav atrasts';

export const resolveThread: ResolveFn<Thread> = async (route) => {
  const dialog = inject(ConfirmationDialogService);

  try {
    const id = notNullOrThrow(route.paramMap.get('id'));
    return await inject(GmailService).thread(id);
  } catch (error) {
    dialog.confirmDataError(NOT_FOUND_MESSAGE);
  }
  return new RedirectCommand(inject(Router).parseUrl('/jobs/gmail'));
};
