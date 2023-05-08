import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Job } from 'src/app/jobs/interfaces';
import { ReproJobService } from './repro-job.service';


type NewJob = Partial<Omit<Job, 'jobId'>>;


const defaultReproJob: () => NewJob = () => ({
  name: '',
  receivedDate: new Date(),
  dueDate: new Date(),
  production: {
    category: 'repro' as const,
  },
  jobStatus: {
    generalStatus: 20,
    timestamp: new Date(),
  }
});

export const newReproJob: ResolveFn<NewJob> = (route) => {

  const reproJobService = inject(ReproJobService);

  const serviceJob = reproJobService.job || {};

  const job = {
    ...defaultReproJob(),
    ...serviceJob,
  };

  if (route.paramMap.get('name')) {
    job.name = route.paramMap.get('name');
  }

  if (route.paramMap.get('customer')) {
    job.customer = route.paramMap.get('customer');
  }

  reproJobService.job = null;

  return job;


}

