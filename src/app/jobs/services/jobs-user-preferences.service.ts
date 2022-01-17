import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { JobsUserPreferences } from '../interfaces/jobs-user-preferences';
import { JobsApiService } from './jobs-api.service';

@Injectable({
  providedIn: 'root'
})
export class JobsUserPreferencesService {

  private readonly reload$ = new Subject<JobsUserPreferences>();

  readonly userPreferences$: Observable<JobsUserPreferences> = merge(
    this.getUserPreferences(),
    this.reload$
  ).pipe(
    shareReplay(1),
  );


  constructor(
    private api: JobsApiService,
  ) { }

  setUserPreferences(preferences: JobsUserPreferences): Observable<JobsUserPreferences> {
    return this.api.setUserPreferences(preferences).pipe(
      tap(preferences => this.reload$.next(preferences))
    );
  }

  private getUserPreferences(): Observable<JobsUserPreferences> {
    return this.api.getUserPreferences().pipe(
      catchError(error => this.setMissingPreferences(error)),
    );
  }

  private setMissingPreferences(error: Error): Observable<JobsUserPreferences> {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return this.setUserPreferences(new JobsUserPreferences());
    }
    throw error;
  }

}
