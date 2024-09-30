import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorsService extends ErrorHandler {
  private router = inject(Router);
  private zone = inject(NgZone);

  handleError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.zone.run(() => this.router.navigate(['/login']));
      }
    }
    // console.error(error);
    super.handleError(error);
    // return throwError('Kļūda!');
  }
}
