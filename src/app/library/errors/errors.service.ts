import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';

@Injectable()
export class ErrorsService extends ErrorHandler {

  constructor(
    private router: Router,
    private zone: NgZone,
    private confirm: ConfirmationDialogService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super();
  }

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
