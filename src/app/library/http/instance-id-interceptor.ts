import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { INSTANCE_ID } from './instance-id';

export const instanceIdInterceptor: HttpInterceptorFn = (request, next) => {
  const instanceId: string = inject(INSTANCE_ID);
  return next(request.clone({
    headers: request.headers.append('Instance-Id', instanceId)
  }));
};
