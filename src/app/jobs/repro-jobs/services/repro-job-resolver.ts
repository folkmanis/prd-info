import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Job } from 'src/app/jobs/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { JobService } from '../../services/job.service';

const invalidJobIdMessage = (id: any) => `Nepareizs darba numurs ${id}`;
const notFoundMessage = (id: number, err: Error) => `Darbs nr. ${id} nav atrasts. Kļūda ${err.message}`;

export const resolveReproJob: ResolveFn<Job> = async (route) => {
  const router = inject(Router);
  const navigateToJobList = () => router.navigate(['jobs', 'repro']);
  const dialog = inject(ConfirmationDialogService);

  const jobId = +route.paramMap.get('jobId');

  if (isNaN(jobId)) {
    navigateToJobList();
    dialog.confirmDataError(invalidJobIdMessage(route.paramMap.get('jobId')));
    return;
  }

  try {
    const job = await firstValueFrom(inject(JobService).getJob(jobId));
    return job;
  } catch (error) {
    navigateToJobList();
    dialog.confirmDataError(notFoundMessage(jobId, error));
  }
};
