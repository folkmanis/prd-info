import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { endOfDay } from 'date-fns';
import { catchError, map, switchMap, tap, timeout, EMPTY, Observable } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { HttpCacheService } from 'src/app/library/http';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from '../../services';
import { Job, JobPartial, JobQueryFilter, JobQueryFilterOptions, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsApiService, JobUpdateParams } from './jobs-api.service';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private notificatinsService: NotificationsService,
    private cacheService: HttpCacheService,
    private confirmationDialogService: ConfirmationDialogService,
    private api: JobsApiService,
    private transformer: ClassTransformer,
  ) { }

  getJobsObserver(filter$: Observable<JobQueryFilter>, reload$: Observable<void>) {

    return combineReload(
      filter$,
      reload$,
      this.notificatinsService.wsMultiplex('jobs').pipe(map(() => undefined))
    ).pipe(
      tap(() => this.cacheService.clear()),
      switchMap(filter => this.getJobList(filter)),
    );
  }


  newJob(job: Partial<Job>, params: JobUpdateParams = {}): Observable<Job> {
    return this.api.insertOne(job, params);
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
    );
  }

  createFolder(jobId: number): Observable<Job> {
    return this.api.createFolder(jobId).pipe(
      catchError(() => this.confirmationDialogService.confirmDataError())
    );
  }

  updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Observable<number> {
    if (jobs.some(job => !job.jobId)) {
      return EMPTY;
    }
    return this.api.updateMany(jobs, params);
  }

  getJob(jobId: number): Observable<Job> {
    return this.api.getOne(jobId);
  }

  getJobList(filter: Partial<JobQueryFilterOptions> = {}): Observable<JobPartial[]> {
    return this.api.getAll(this.normalizeFilter(filter), false);
  }

  getJobListUnwinded(filter: Partial<JobQueryFilterOptions> = {}): Observable<JobUnwindedPartial[]> {

    return this.api.getAll(this.normalizeFilter(filter), true);
  }

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.api.jobsWithoutInvoicesTotals();
  }

  normalizeFilter(jobFilter: Record<string, any>): JobQueryFilter {
    return this.transformer.plainToInstance(JobQueryFilter, jobFilter);
  }


}
