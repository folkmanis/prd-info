import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { DEFAULT_FILTER } from '../../interfaces';

export const appendJobStatus: CanActivateFn = (route) => {

  if (!route.queryParams['jobStatus']) {
    const queryParams = { ...route.queryParams };
    queryParams.jobStatus = DEFAULT_FILTER.jobStatus;
    const url = createUrlTreeFromSnapshot(route, [], queryParams);
    return url;
  }

  return true;

};
