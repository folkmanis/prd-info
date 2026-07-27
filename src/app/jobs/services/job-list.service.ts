import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { inject, Service } from '@angular/core';
import { debounceTime, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { JobsApiService } from 'src/app/jobs/services/jobs-api.service';
import { FilterInput } from 'src/app/library';
import { combineReload } from 'src/app/library/rxjs';
import { PagedCache } from 'src/app/library/rxjs/paged-cache';
import { JobFilter, JobPartial, JobsProduction, JobUnwindedPartial } from '../interfaces';

export class JobsData<T extends object> extends DataSource<T | undefined> {
  private reload$ = new Subject<void>();

  constructor(private cache: PagedCache<T>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    const range$ = collectionViewer.viewChange.pipe(startWith({ start: 0, end: 99 }), debounceTime(100));
    return combineReload(range$, this.reload$).pipe(switchMap((range) => this.cache.fetchRange(range)));
  }

  // eslint-disable-next-line
  disconnect() {}

  updateAt(idx: number, update: Partial<T>) {
    const job = this.cache.getAt(idx);
    if (job) {
      this.cache.updateAt(idx, { ...job, ...update });
      this.reload$.next();
    }
  }
}

@Service()
export class JobListService {
  #api = inject(JobsApiService);

  getData(filter$: Observable<JobFilter>): Observable<JobsData<JobPartial>> {
    return filter$.pipe(
      switchMap((filter) =>
        this.#api.getJobsCount({ ...filter, unwindProducts: false }).pipe(
          map(({ count }) => new PagedCache<JobPartial>(count, this.#fetchRecordsFn(filter))),
          map((cache) => new JobsData(cache)),
        ),
      ),
    );
  }

  getUnwindedData(filter$: Observable<JobFilter>): Observable<JobsData<JobUnwindedPartial>> {
    return filter$.pipe(
      switchMap((filter) =>
        this.#api.getJobsCount({ ...filter, unwindProducts: true }).pipe(
          map(({ count }) => new PagedCache<JobUnwindedPartial>(count, this.#fetchUnwindedRecordsFn(filter))),
          map((cache) => new JobsData(cache)),
        ),
      ),
    );
  }

  productsSummary(filter: JobFilter): Observable<JobsProduction[]> {
    return this.#api.jobsProductionSummary(filter);
  }

  #fetchRecordsFn(filter: JobFilter): (start: number, limit: number) => Promise<JobPartial[]> {
    return (start, limit) => this.#api.getAll({ ...filter, start, limit });
  }

  #fetchUnwindedRecordsFn(
    filter: FilterInput<JobFilter>,
  ): (start: number, limit: number) => Promise<JobUnwindedPartial[]> {
    return (start, limit) => this.#api.getAllUnwinded({ ...filter, start, limit });
  }
}
