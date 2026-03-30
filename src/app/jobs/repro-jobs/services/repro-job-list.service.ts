import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { debounceTime, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { JobsApiService } from 'src/app/jobs/services/jobs-api.service';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { PagedCache } from 'src/app/library/rxjs/paged-cache';
import { JobFilter, jobFilterToRequestQuery, JobPartial, JobsProduction } from '../../interfaces';
import { combineReload } from 'src/app/library/rxjs';

export class JobsData extends DataSource<JobPartial | undefined> {
  private reload$ = new Subject<void>();

  constructor(private cache: PagedCache<JobPartial>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(JobPartial | undefined)[]> {
    const range$ = collectionViewer.viewChange.pipe(startWith({ start: 0, end: 99 }), debounceTime(100));
    return combineReload(range$, this.reload$).pipe(switchMap((range) => this.cache.fetchRange(range)));
  }

  disconnect() {}

  updateAt(idx: number, update: Partial<JobPartial>) {
    const job = this.cache.getAt(idx);
    if (job) {
      this.cache.updateAt(idx, { ...job, ...update });
      this.reload$.next();
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ReproJobListService {
  #api = inject(JobsApiService);

  getData(filter$: Observable<JobFilter>): Observable<JobsData> {
    return filter$.pipe(
      map(({ start, limit, ...filter }) => jobFilterToRequestQuery(filter)),
      switchMap((query) =>
        this.#api.getJobsCount(query).pipe(
          map(({ count }) => new PagedCache<JobPartial>(count, this.#fetchRecordsFn(query))),
          map((cache) => new JobsData(cache)),
        ),
      ),
    );
  }

  productsSummaryResource(filter: FilterInput<JobFilter>): HttpResourceRef<JobsProduction[] | undefined> {
    const query = computed(() => jobFilterToRequestQuery(toFilterSignal(filter)()));
    return this.#api.getJobsProductionResource(query);
  }

  #fetchRecordsFn(query: Record<string, any> | undefined): (start: number, limit: number) => Promise<JobPartial[]> {
    return (start, limit) => this.#api.getAll({ ...query, start, limit });
  }
}
