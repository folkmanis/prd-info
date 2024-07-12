import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { asyncScheduler, scheduled, tap } from 'rxjs';
import { HttpCacheService } from './http-cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(HttpCacheService);

  if (!isCacheable(req)) {
    return next(req).pipe(tap(() => isCacheDirty(req) && cache.clear()));
  }
  const cachedResponse = cache.get(req);
  if (cachedResponse !== null) {
    return scheduled([cachedResponse], asyncScheduler);
  }

  return next(req).pipe(tap((event) => event instanceof HttpResponse && cache.put(req, event)));
};

function isCacheable(req: HttpRequest<any>): boolean {
  return req.method === 'GET' && req.headers.get('Cache') === 'Ok';
}

function isCacheDirty(req: HttpRequest<any>): boolean {
  return req.method !== 'GET';
}
