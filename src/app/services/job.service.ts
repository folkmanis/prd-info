import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services';

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

  newJob(job: Partial<Job>): Observable<number | null> {
    return this.prdApi.jobs.insertOne(job).pipe(
      map(id => +id),
      tap(() => this._updateJobs$.next()),
    );
  }

  newJobs(jobs: Partial<Job>[]): Observable<number | null> {
    return this.prdApi.jobs.insertMany(jobs).pipe(
      tap(() => this._updateJobs$.next()),
    );
  }

  updateJob(job: Partial<Job>): Observable<boolean> {
    if (!job.jobId) { return of(false); }
    return this.prdApi.jobs.updateOne(
      job.jobId,
      {
        ...job,
        jobId: undefined,
        _id: undefined,
      }
    ).pipe(
      tap(resp => resp && this._updateJobs$.next()),
    );
  }

  getJob(jobId: number): Observable<Job | undefined> {
    return this.prdApi.jobs.get(jobId);
  }

  private getJobList(filter?: JobQueryFilter): Observable<JobPartial[]> {
    return this.prdApi.jobs.get(filter);
  }

}
