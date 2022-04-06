import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';



@Injectable()
export class GmailLoginInterceptor implements HttpInterceptor {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (!request.url.includes('gmail')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      this.catchGmailLogin(),
    );
  }

  private catchGmailLogin(): MonoTypeOperatorFunction<HttpEvent<unknown>> {
    return catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 403) {
        const redirect = this.document.location.href;
        this.document.location.href = `/data/login/google?redirect=${redirect}&scope=${this.params.gmailScope}`;
      }
      throw err;
    });
  }

}
