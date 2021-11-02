import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { combineLatest, EMPTY, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services';
import { NotificationsService } from './notifications.service';
import { log } from 'prd-cdk';
import { HttpCacheService } from 'src/app/library/http';

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
    private prdApi: PrdApiService,
    private notificatinsService: NotificationsService,
    private cacheService: HttpCacheService,
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

  newJob(job: Partial<Job>, params?: JobUpdateParams): Observable<number | null> {
    return this.prdApi.jobs.insertOne(job, params).pipe(
      map(id => +id),
      tap(() => this.forceReload$.next()),
    );
  }

  updateJob(jobId: number, job: Partial<Job>, params?: JobUpdateParams): Observable<Job> {
    if (job.dueDate) {
      job.dueDate = endOfDay(new Date(job.dueDate));
    }
    return this.prdApi.jobs.updateOne(
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

  updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Observable<number> {
    jobs.forEach(job => {
      if (!job.jobId) { return EMPTY; }
    });
    return this.prdApi.jobs.updateMany(jobs, params).pipe(
      tap(resp => resp && this.forceReload$.next()),
    );
  }

  getJob(jobId: number): Observable<Job> {
    return this.prdApi.jobs.get(jobId);
  }

  getJobList(filter?: JobQueryFilter): Observable<JobPartial[]> {
    return this.prdApi.jobs.get(filter);
  }

}
