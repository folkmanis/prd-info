import { HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { endOfDay } from 'date-fns';
import { Observable } from 'rxjs';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { Job, JobFilter, JobPartial, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsApiService, JobUpdateParams } from './jobs-api.service';

@Service()
export class JobService {
  #api = inject(JobsApiService);

  async newJob(job: Partial<Job>, params: JobUpdateParams = {}): Promise<Job> {
    return this.#api.insertOne(job, params);
  }

  async updateJob(jobId: number, job: Partial<Job>, params: JobUpdateParams = {}): Promise<Job> {
    if (job.dueDate) {
      job.dueDate = endOfDay(new Date(job.dueDate));
    }
    if (job.jobStatus) {
      job.jobStatus.timestamp = new Date();
    }
    return this.#api.updateOne(
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
    return this.#api.createFolder(jobId);
  }

  async updateJobs(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    if (jobs.some((job) => !job.jobId)) {
      return 0;
    }
    return this.#api.updateMany(jobs, params);
  }

  getJob(jobId: number): Promise<Job> {
    return this.#api.getOne(jobId);
  }

  getJobsResource(filter: FilterInput<JobFilter | undefined>): HttpResourceRef<JobPartial[] | undefined> {
    return this.#api.jobsResource(toFilterSignal(filter));
  }

  getJobsUnwindedResource(
    filter: FilterInput<JobFilter | undefined>,
  ): HttpResourceRef<JobUnwindedPartial[] | undefined> {
    return this.#api.jobsUnwindedResource(toFilterSignal(filter));
  }

  getJobListUnwinded(filter: JobFilter = {}): Promise<JobUnwindedPartial[]> {
    return this.#api.getAllUnwinded(filter);
  }

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.#api.jobsWithoutInvoicesTotals();
  }
}
