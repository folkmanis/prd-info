import { ResolveFn } from '@angular/router';
import { JobFilter, queryParamsToJobFilter } from '../../interfaces';

export const jobFilterResolver: ResolveFn<JobFilter> = (route) => {
  return queryParamsToJobFilter(route.queryParamMap);
};
