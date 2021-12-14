import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { combineLatest, EMPTY, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, pluck, share, startWith, switchMap, tap } from 'rxjs/operators';
import { Job, JobPartial, JobQueryFilter, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { NotificationsService } from '../../services';
import { HttpCacheService } from 'src/app/library/http';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { JobsApiService } from './jobs-api.service';

interface JobUpdateParams {
  createFolder?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private readonly _filter$: Subject<JobQueryFilter> = new ReplaySubject(1);

  private readonly forceReload$: Subject<void> = new Subject();

  private readonly reload$ = merge(
    this.forceReload$,
    this.notificatinsService.wsMultiplex('jobs')
  ).pipe(
    tap(() => this.cacheService.clear()),
    startWith(''),
  );

  constructor(
    private notificatinsService: NotificationsService,
    private cacheService: HttpCacheService,
    private confirmationDialogService: ConfirmationDialogService,
    private api: JobsApiService,
  ) { }

  jobs$: Observable<JobPartial[]> = combineLatest([
    this._filter$,
    this.reload$,
  ]).pipe(
    switchMap(([filter]) => this.getJobList(filter)),
    share(),
  );

  setFilter(fltr: JobQueryFilter): void {
    this._filter$.next(fltr);
  }

  reload() {
    this.forceReload$.next();
  }

  newJob(job: Partial<Job>, params?: JobUpdateParams): Observable<number> {
    return this.api.insertOne(job, params).pipe(
      pluck('jobId'),
      tap(() => this.forceReload$.next()),
      catchError(() => this.confirmationDialogService.confirmDataError())
    );
  }

  updateJob(jobId: number, job: Partial<Job>, params?: JobUpdateParams): Observable<Job> {
    if (job.dueDate) {
      job.dueDate = endOfDay(new Date(job.dueDate));
    }
    return this.api.updateOne(
      jobId,
      {
        ...job,
        jobId: undefined,
        _id: undefined,
      },
      params
    ).pipe(
      tap(resp => resp && this.forceReload$.next()),
    );
  }

  createFolder(jobId: number) {
    return this.api.createFolder(jobId).pipe(
      catchError(() => this.confirmationDialogService.confirmDataError())
    );
  }

  updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Observable<number> {
    jobs.forEach(job => {
      if (!job.jobId) { return EMPTY; }
    });
    return this.api.updateMany(jobs, params).pipe(
      tap(resp => resp && this.forceReload$.next()),
    );
  }

  getJob(jobId: number): Observable<Job> {
    return this.api.get(jobId);
  }

  getJobList(filter: JobQueryFilter = {}): Observable<JobPartial[]> {
    filter.unwindProducts = 0;
    return this.api.get(filter);
  }

  getJobListUnwinded(filter: JobQueryFilter = {}): Observable<JobUnwindedPartial[]> {
    filter.unwindProducts = 1;
    return this.api.get(filter);
  }

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.api.jobsWithoutInvoicesTotals();
  }

}