import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppHttpResponseBase } from './app-http-response-base';
import { ApiVersionService } from './api-version.service';
import { ApiVersion } from './api-version';

@Injectable()
export class VersionInterceptorService implements HttpInterceptor {

  constructor(
    private versionService: ApiVersionService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<AppHttpResponseBase>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.headers.has('API-Version')) {
          const ver: ApiVersion = {
            apiBuild: +(event.headers.get('API-Version') || 0),
            appBuild: +(event.headers.get('APP-Version') || 0),
          };
          this.versionService.setVersion(ver);
        }
      })
    );
  }
}
