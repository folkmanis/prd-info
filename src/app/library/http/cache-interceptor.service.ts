import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { HttpCacheService } from './http-cache.service';

@Injectable()
export class CacheInterceptorService implements HttpInterceptor {

  constructor(
    private cache: HttpCacheService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCacheable(req)) {
      return next.handle(req).pipe(
        tap(() => this.isCacheDirty(req) && this.cache.clear()),
      );
    }
    const cachedResponse = this.cache.get(req);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }
    return next.handle(req).pipe(
      tap(event => (event instanceof HttpResponse) && this.cache.put(req, event)),
    );
  }

  private isCacheable(req: HttpRequest<any>): boolean {
    return (req.method === 'GET') && (req.headers.get('Cache') === 'Ok');
  }

  private isCacheDirty(req: HttpRequest<any>): boolean {
    return req.method !== 'GET';
  }

}
