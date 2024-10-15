import { Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { AppClassTransformerService } from 'src/app/library';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from '../../services';
import { Job, JobPartial, JobQueryFilter, JobQueryFilterOptions, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsApiService, JobUpdateParams } from './jobs-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(
    private notificatinsService: NotificationsService,
    private api: JobsApiService,
    private transformer: AppClassTransformerService,
  ) {}

  getJobsObserver(filter$: Observable<JobQueryFilter>, reload$: Observable<void>) {
    return combineReload(filter$, reload$, this.notificatinsService.wsMultiplex('jobs').pipe(map(() => undefined))).pipe(switchMap((filter) => this.getJobList(filter)));
  }

  async newJob(job: Partial<Job>, params: JobUpdateParams = {}): Promise<Job> {
    return firstValueFrom(this.api.insertOne(job, params));
  }

  async updateJob(jobId: number, job: Partial<Job>, params: JobUpdateParams = {}): Promise<Job> {
    if (job.dueDate) {
      job.dueDate = endOfDay(new Date(job.dueDate));
    }
    if (job.jobStatus) {
      job.jobStatus.timestamp = new Date();
    }
    const jobUpdate$ = this.api.updateOne(
      jobId,
      {
        ...job,
        jobId: undefined,
        _id: undefined,
      },
      params,
    );
    return firstValueFrom(jobUpdate$);
  }

  async createFolder(jobId: number): Promise<Job> {
    return firstValueFrom(this.api.createFolder(jobId));
  }

  async updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    if (jobs.some((job) => !job.jobId)) {
      return 0;
    }
    return this.api.updateMany(jobs, params);
  }

  getJob(jobId: number): Observable<Job> {
    return this.api.getOne(jobId);
  }

  getJobList(filter: Partial<JobQueryFilterOptions> = {}): Observable<JobPartial[]> {
    return this.api.getAll(this.transformer.plainToInstance(JobQueryFilter, filter), false);
  }

  getJobListUnwinded(filter: Partial<JobQueryFilterOptions> = {}): Observable<JobUnwindedPartial[]> {
    return this.api.getAll(this.transformer.plainToInstance(JobQueryFilter, filter), true);
  }

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.api.jobsWithoutInvoicesTotals();
  }
}
