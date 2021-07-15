import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { combineLatest, EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services';

interface JobUpdateParams {
  createFolder?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private readonly _updateJobs$: Subject<void> = new Subject();
  private readonly _filter$: Subject<JobQueryFilter> = new ReplaySubject(1);

  constructor(
    private prdApi: PrdApiService,
  ) { }

  jobs$: Observable<JobPartial[]> = combineLatest([
    this._filter$,
    this._updateJobs$.pipe(startWith('')),
  ]).pipe(
    switchMap(([filter]) => this.getJobList(filter)),
    share(),
  );

  setFilter(fltr: JobQueryFilter): void {
    this._filter$.next(fltr);
  }

  newJob(job: Partial<Job>, params?: JobUpdateParams): Observable<number | null> {
    return this.prdApi.jobs.insertOne(job, params).pipe(
      map(id => +id),
      tap(() => this._updateJobs$.next()),
    );
  }

  newJobs(jobs: Partial<Job>[]): Observable<number | null> {
    return this.prdApi.jobs.insertMany(jobs).pipe(
      tap(() => this._updateJobs$.next()),
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
      tap(resp => resp && this._updateJobs$.next()),
    );
  }

  updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Observable<number> {
    jobs.forEach(job => {
      if (!job.jobId) { return EMPTY; }
    });
    return this.prdApi.jobs.update(jobs, params).pipe(
      tap(resp => resp && this._updateJobs$.next()),
    );
  }

  getJob(jobId: number): Observable<Job | undefined> {
    return this.prdApi.jobs.get(jobId);
  }

  getJobList(filter?: JobQueryFilter): Observable<JobPartial[]> {
    return this.prdApi.jobs.get(filter);
  }

}
