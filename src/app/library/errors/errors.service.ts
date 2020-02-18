import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorsService implements ErrorHandler {

  constructor(
  ) { }

  handleError(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        // location.pathname = '/login';
      }
    }
    console.error('Error ', error);
    if (error.error instanceof ErrorEvent) {
    } else {
      console.error(`Status code ${error.status}, body: ${error.error}`);
    }
    return throwError('Kļūda!');
  }

}
