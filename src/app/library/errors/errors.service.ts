import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorsService implements ErrorHandler {

  constructor(
    private router: Router,
    private zone: NgZone,
  ) { }

  handleError(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.zone.run(() => this.router.navigate(['/login']));
      }
    }
    if (error.error instanceof ErrorEvent) {
    } else {
      console.error(`Status code ${error.status}, body:`, error.error);
    }
    return throwError('Kļūda!');
  }

}
