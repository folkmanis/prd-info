import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JobTemplate, ReproJobService } from './repro-job.service';

const defaultReproJob: () => JobTemplate = () => ({
  name: '',
  receivedDate: new Date(),
  dueDate: new Date(),
  production: {
    category: 'repro' as const,
  },
  jobStatus: {
    generalStatus: 20,
    timestamp: new Date(),
  },
});

export const newReproJob: ResolveFn<JobTemplate> = () => {
  const jobTemplate = inject(ReproJobService).retrieveJobTemplate() ?? {};

  const job = {
    ...defaultReproJob(),
    ...jobTemplate,
  };

  return job;
};
