import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Job } from 'src/app/jobs/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { JobService } from '../../services/job.service';


const invalidJobIdMessage = (id: any) => `Nepareizs darba numurs ${id}`;
const notFoundMessage = (id: number, err: Error) => `Darbs nr. ${id} nav atrasts. Kļūda ${err.message}`;

export const resolveReproJob: ResolveFn<Job> = (route) => {

  const router = inject(Router);
  const dialog = inject(ConfirmationDialogService);

  const jobId = +route.paramMap.get('jobId');

  if (isNaN(jobId)) {
    router.navigate(['jobs', 'repro']);
    return dialog.confirmDataError(invalidJobIdMessage(route.paramMap.get('jobId')));
  }

  return inject(JobService).getJob(jobId).pipe(
    catchError(err => {
      router.navigate(['jobs', 'repro']);
      return dialog.confirmDataError(notFoundMessage(jobId, err));
    })
  );

};
