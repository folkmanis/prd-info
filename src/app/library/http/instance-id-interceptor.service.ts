import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INSTANCE_ID } from './instance-id';

@Injectable()
export class InstanceIdInterceptorService implements HttpInterceptor {

  constructor(
    @Inject(INSTANCE_ID) private instanceId: string,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(
      request.clone({
        headers: request.headers.append('Instance-Id', this.instanceId)
      })
    );
  }


}
