import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { EMPTY, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, timeout, mapTo, pluck, share, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { HttpCacheService } from 'src/app/library/http';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from '../../services';
import { Job, JobPartial, JobQueryFilter, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
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

  private readonly reload$: Observable<void> = merge(
    this.forceReload$,
    this.notificatinsService.wsMultiplex('jobs')
  ).pipe(
    tap(() => this.cacheService.clear()),
    mapTo(undefined),
  );

  readonly jobs$: Observable<JobPartial[]> = combineReload(
    this._filter$,
    this.reload$,
  ).pipe(
    switchMap(filter => this.getJobList(filter)),
    share(),
  );

  readonly filter$: Observable<JobQueryFilter> = this._filter$.asObservable();

  constructor(
    private notificatinsService: NotificationsService,
    private cacheService: HttpCacheService,
    private confirmationDialogService: ConfirmationDialogService,
    private api: JobsApiService,
  ) { }

  setFilter(fltr: JobQueryFilter): void {
    this._filter$.next(fltr);
  }

  reload() {
    this.forceReload$.next();
  }

  newJob(job: Partial<Job>, params?: JobUpdateParams): Observable<number> {
    return this.api.insertOne(job, params).pipe(
      pluck('jobId'),
      tap(() => this.reload()),
      catchError(() => this.confirmationDialogService.confirmDataError())
    );
  }

  updateJob(jobId: number, job: Partial<Job>, params?: JobUpdateParams): Observable<Job> {
    if (job.dueDate) {
      job.dueDate = endOfDay(new Date(job.dueDate));
    }
    if (job.jobStatus) {
      job.jobStatus.timestamp = new Date();
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
      timeout(10 * 1000),
      tap(_ => this.reload()),
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
      tap(_ => this.reload()),
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

  moveUserFilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.api.transferUserfilesToJob(jobId, fileNames).pipe(
      tap(() => this.reload()),
    );
  }

}
