import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { EMPTY, Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap, timeout } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { HttpCacheService } from 'src/app/library/http';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from '../../services';
import { Job, JobPartial, JobQueryFilter, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsApiService, JobUpdateParams } from './jobs-api.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private readonly filter$: Subject<JobQueryFilter> = new ReplaySubject(1);

  private readonly forceReload$: Subject<void> = new Subject();

  readonly jobs$: Observable<JobPartial[]> = combineReload(
    this.filter$,
    this.forceReload$,
    this.notificatinsService.wsMultiplex('jobs').pipe(map(() => undefined))
  ).pipe(
    tap(() => this.cacheService.clear()),
    switchMap(filter => this.getJobList(filter)),
    shareReplay(1),
  );

  readonly activeFilter$: Observable<JobQueryFilter> = this.filter$.asObservable();

  constructor(
    private notificatinsService: NotificationsService,
    private cacheService: HttpCacheService,
    private confirmationDialogService: ConfirmationDialogService,
    private api: JobsApiService,
  ) { }

  setFilter(fltr: JobQueryFilter): void {
    this.filter$.next(fltr);
  }

  reload() {
    this.forceReload$.next();
  }

  newJob(job: Partial<Job>, params: JobUpdateParams = {}): Observable<Job> {
    return this.api.insertOne(job, params).pipe(
      tap(() => this.reload()),
    );
  }

  updateJob(jobId: number, job: Partial<Job>, params: JobUpdateParams = {}): Observable<Job> {
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
    return this.api.getOne(jobId);
  }

  getJobList(filter: JobQueryFilter = {}): Observable<JobPartial[]> {
    return this.api.getAll(filter, false);
  }

  getJobListUnwinded(filter: JobQueryFilter = {}): Observable<JobUnwindedPartial[]> {
    return this.api.getAll(filter, true);
  }

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.api.jobsWithoutInvoicesTotals();
  }

}
