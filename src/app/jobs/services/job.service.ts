import { Injectable } from '@angular/core';
import { Job, JobPartial, JobQueryFilter, Invoice, InvoiceResponse } from 'src/app/interfaces';
import { Observable, of, Subject, combineLatest, ReplaySubject, BehaviorSubject } from 'rxjs';
import { map, tap, startWith, switchMap, share, pluck } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services';

@Injectable()
export class JobService {

  private readonly updateJobs$: Subject<void> = new Subject();
  readonly filter$: Subject<JobQueryFilter> = new ReplaySubject(1);

  constructor(
    private prdApi: PrdApiService,
  ) { }

  jobs$: Observable<JobPartial[]> = combineLatest([
    this.filter$,
    this.updateJobs$.pipe(startWith('')),
  ]).pipe(
    switchMap(([filter]) => this.getJobList(filter)),
    share(),
  );

  newJob(job: Partial<Job>): Observable<number> {
    return this.prdApi.jobs.insertOne(job).pipe(
      map(id => +id),
      tap(() => this.updateJobs$.next()),
    );
  }

  updateJob(job: Partial<Job>): Observable<boolean> {
    if (!job.jobId) { return of(false); }
    const jobId = job.jobId;
    delete job.jobId;
    delete job._id;
    return this.prdApi.jobs.updateOne(jobId, job).pipe(
      tap(resp => resp && this.updateJobs$.next()),
    );
  }

  getJob(jobId: number): Observable<Job | undefined> {
    return this.prdApi.jobs.get(jobId);
  }

  private getJobList(filter?: JobQueryFilter): Observable<JobPartial[]> {
    return this.prdApi.jobs.get(filter);
  }

}
