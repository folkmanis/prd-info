import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Job } from 'src/app/jobs/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { JobService } from '../../services/job.service';
import { parseJobId } from './parse-job-id';

const invalidJobIdMessage = (id: any) => `Nepareizs darba numurs ${id}`;
const notFoundMessage = (id: number, err: Error) => `Darbs nr. ${id} nav atrasts. Kļūda ${err.message}`;

export const resolveReproJob: ResolveFn<Omit<Job, 'jobId'>> = async (route) => {
  const jobList = inject(Router).createUrlTree(['jobs', 'repro']);
  const dialog = inject(ConfirmationDialogService);

  const jobId = parseJobId(route.paramMap.get('jobId'));

  if (jobId === null) {
    dialog.confirmDataError(invalidJobIdMessage(route.paramMap.get('jobId')));
    return new RedirectCommand(jobList);
  }

  try {
    const { jobId: _, ...job } = await inject(JobService).getJob(jobId);
    return job;
  } catch (error) {
    dialog.confirmDataError(notFoundMessage(jobId, error));
    return new RedirectCommand(jobList);
  }
};
