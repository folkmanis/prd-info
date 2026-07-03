import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Service()
export class ErrorsService extends ErrorHandler {
  private router = inject(Router);

  private snack = inject(MatSnackBar);

  handleError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
    }
    this.snack.open(`Kļūda: ${error.message}`, 'OK');
    // console.error(error);
    super.handleError(error);
    // return throwError('Kļūda!');
  }
}
