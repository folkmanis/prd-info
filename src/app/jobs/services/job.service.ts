import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Job, JobResponse, JobPartial, JobQueryFilter } from './job';
import { Observable, of, Subject, combineLatest, ReplaySubject, BehaviorSubject } from 'rxjs';
import { map, tap, startWith, switchMap } from 'rxjs/operators';

@Injectable()
export class JobService {

  private readonly httpPath = '/data/jobs/';

  private readonly updateJobs$: Subject<void> = new Subject();
  readonly filter$: Subject<JobQueryFilter> = new BehaviorSubject({});

  constructor(
    private http: HttpClient,
  ) { }

  jobs$: Observable<JobPartial[]> = combineLatest([
    this.filter$,
    this.updateJobs$.pipe(startWith('')),
  ]).pipe(
    switchMap(([filter]) => this.getJobList(filter))
  );

  newJob(job: Partial<Job>): Observable<Job> {
    console.log(job);
    return this.http.post<JobResponse>(this.httpPath, job, new HttpOptions()).pipe(
      tap(resp => resp.insertedId && this.updateJobs$.next()),
      map(resp => resp.job),
    );
  }

  updateJob(job: Partial<Job>): Observable<boolean> {
    if (!job.jobId) { return of(false); }
    const jobId = job.jobId;
    delete job.jobId;
    delete job._id;
    return this.http.post<JobResponse>(this.httpPath + jobId, job).pipe(
      tap(resp => resp.modifiedCount > 0 && this.updateJobs$.next()),
      map(resp => !!resp.modifiedCount),
    );
  }

  getJob(jobId: number): Observable<Job | undefined> {
    return this.http.get<JobResponse>(this.httpPath + jobId, new HttpOptions().cacheable()).pipe(
      map(resp => resp.job)
    );
  }

  private getJobList(filter?: JobQueryFilter): Observable<JobPartial[]> {
    return this.http.get<JobResponse>(this.httpPath, new HttpOptions(filter).cacheable()).pipe(
      map(resp => resp.jobs)
    );
  }

}
