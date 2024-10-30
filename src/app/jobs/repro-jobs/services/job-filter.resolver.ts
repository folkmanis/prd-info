import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AppClassTransformerService } from 'src/app/library';
import { JobQueryFilter } from '../../interfaces';

export const jobFilterResolver: ResolveFn<JobQueryFilter> = (route) => {
  const transformer = inject(AppClassTransformerService);
  const filter = transformer.plainToInstance(JobQueryFilter, route.queryParams);
  if (!filter.jobStatus) {
    filter.jobStatus = JobQueryFilter.default().jobStatus;
  }
  return filter;
};
