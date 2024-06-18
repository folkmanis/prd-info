import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MonoTypeOperatorFunction, catchError } from 'rxjs';
import { getAppParams } from 'src/app/app-params';


export const gmailLoginInterceptor: HttpInterceptorFn = (request, next) => {

  const gmailScope = getAppParams('gmailScope');
  const document = inject(DOCUMENT);

  function catchGmailLogin(): MonoTypeOperatorFunction<HttpEvent<unknown>> {
    return catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 403) {
        const redirect = document.location.href;
        document.location.href = `/data/login/google?redirect=${redirect}&scope=${gmailScope}`;
      }
      throw err;
    });
  }

  if (!request.url.includes('gmail')) {
    return next(request);
  }

  return next(request).pipe(
    catchGmailLogin(),
  );


};

