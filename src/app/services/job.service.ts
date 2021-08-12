import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { combineLatest, EMPTY, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services';
import { NotificationsService } from './notifications.service';

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
    this.notificatinsService.multiplex('jobs'),
  ).pipe(
    startWith('')
  );

  constructor(
    private prdApi: PrdApiService,
    private notificatinsService: NotificationsService,
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

  newJobs(jobs: Partial<Job>[]): Observable<number | null> {
    return this.prdApi.jobs.insertMany(jobs).pipe(
      tap(() => this.forceReload$.next()),
    );
  }

  updateJob(job: Partial<Job>, params?: JobUpdateParams): Observable<boolean> {
    if (!job.jobId) { return of(false); }
    if (job.dueDate) {
      job.dueDate = endOfDay(new Date(job.dueDate));
    }
    return this.prdApi.jobs.updateOne(
      job.jobId,
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
    return this.prdApi.jobs.update(jobs, params).pipe(
      tap(resp => resp && this.forceReload$.next()),
    );
  }

  getJob(jobId: number): Observable<Job | undefined> {
    return this.prdApi.jobs.get(jobId);
  }

  getJobList(filter?: JobQueryFilter): Observable<JobPartial[]> {
    return this.prdApi.jobs.get(filter);
  }

}
