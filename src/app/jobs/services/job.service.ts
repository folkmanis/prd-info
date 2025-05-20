import { computed, inject, Injectable, Signal } from '@angular/core';
import { endOfDay } from 'date-fns';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { Job, JobFilter, jobFilterToRequestQuery, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsApiService, JobUpdateParams } from './jobs-api.service';

function filterInputToRequestQuery(filter: FilterInput<JobFilter>): Signal<Record<string, any>> {
  const filterSignal = toFilterSignal(filter);
  return computed(() => jobFilterToRequestQuery(filterSignal()));
}

@Injectable({
  providedIn: 'root',
})
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

  getJobsResource(filter: FilterInput<JobFilter>) {
    return this.#api.jobsResource(filterInputToRequestQuery(filter));
  }

  getJobsUnwindedResource(filter: FilterInput<JobFilter>) {
    return this.#api.jobsUnwindedResource(filterInputToRequestQuery(filter));
  }

  getJobListUnwinded(filter: FilterInput<JobFilter> = {}): Promise<JobUnwindedPartial[]> {
    return this.#api.getAllUnwinded(filterInputToRequestQuery(filter));
  }

  getJobsWithoutInvoicesTotals(): Promise<JobsWithoutInvoicesTotals[]> {
    return this.#api.jobsWithoutInvoicesTotals();
  }
}
