import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiVersion } from './api-version';
import { ApiVersionService } from './api-version.service';

export const versionInterceptor: HttpInterceptorFn = (request, next) => {
  const versionService = inject(ApiVersionService);
  return next(request).pipe(
    tap(event => {
      if (event instanceof HttpResponse && event.headers.has('API-Version')) {
        const ver: ApiVersion = {
          apiBuild: +(event.headers.get('API-Version') || 0),
          appBuild: +(event.headers.get('APP-Version') || 0),
        };
        versionService.setVersion(ver);
      }
    })
  );

};
