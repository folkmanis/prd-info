import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JobTemplate, ReproJobService } from './repro-job.service';

const defaultReproJob: () => JobTemplate = () => ({
  name: '',
  customer: null,
  receivedDate: new Date(),
  dueDate: new Date(),
  production: {
    category: 'repro' as const,
  },
  comment: null,
  customerJobId: null,
  jobStatus: {
    generalStatus: 20,
    timestamp: new Date(),
  },
  products: [],
  files: null,
  productionStages: [],
});

export const newReproJob: ResolveFn<JobTemplate> = () => {
  const jobTemplate = inject(ReproJobService).retrieveJobTemplate() ?? {};

  const job = {
    ...defaultReproJob(),
    ...jobTemplate,
  };
  return job;
};
