import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorsService extends ErrorHandler {
  private router = inject(Router);
  private zone = inject(NgZone);

  private snack = inject(MatSnackBar);

  handleError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.zone.run(() => this.router.navigate(['/login']));
      }
    }
    this.snack.open(`Kļūda: ${error.message}`, 'OK');
    // console.error(error);
    super.handleError(error);
    // return throwError('Kļūda!');
  }
}
