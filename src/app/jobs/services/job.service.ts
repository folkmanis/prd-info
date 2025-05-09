import { inject, Injectable } from '@angular/core';
import { endOfDay } from 'date-fns';
import { AppClassTransformerService, FilterInput, toFilterSignal } from 'src/app/library';
import { Job, JobQueryFilter, JobQueryFilterOptions, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsApiService, JobUpdateParams } from './jobs-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private api = inject(JobsApiService);
  private transformer = inject(AppClassTransformerService);

  async newJob(job: Partial<Job>, params: JobUpdateParams = {}): Promise<Job> {
    return this.api.insertOne(job, params);
  }

  async updateJob(jobId: number, job: Partial<Job>, params: JobUpdateParams = {}): Promise<Job> {
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
      params,
    );
  }

  createFolder(jobId: number): Promise<Job> {
    return this.api.createFolder(jobId);
  }

  async updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    if (jobs.some((job) => !job.jobId)) {
      return 0;
    }
    return this.api.updateMany(jobs, params);
  }

  getJob(jobId: number): Promise<Job> {
    return this.api.getOne(jobId);
  }

  getJobsResource(filter: FilterInput<JobQueryFilter>) {
    return this.api.jobsResource(toFilterSignal(filter));
  }

  getJobsUnwindedResource(filter: FilterInput<JobQueryFilter>) {
    return this.api.jobsUnwindedResource(toFilterSignal(filter));
  }

  getJobListUnwinded(filter: Partial<JobQueryFilterOptions> = {}): Promise<JobUnwindedPartial[]> {
    return this.api.getAllUnwinded(this.transformer.plainToInstance(JobQueryFilter, filter));
  }

  getJobsWithoutInvoicesTotals(): Promise<JobsWithoutInvoicesTotals[]> {
    return this.api.jobsWithoutInvoicesTotals();
  }
}
