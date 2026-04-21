import { Injectable, Signal, computed, inject } from '@angular/core';
import { formatISO } from 'date-fns';
import { notNullOrThrow } from 'src/app/library';
import { pickNotNull } from 'src/app/library/assert-utils';
import { JobsUserPreferences } from '../../interfaces/jobs-user-preferences';
import { JobsApiService } from '../../services/jobs-api.service';
import { JobsUserPreferencesService } from '../../services/jobs-user-preferences.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsProductionService {
  #preferencesService = inject(JobsUserPreferencesService);
  #api = inject(JobsApiService);

  getJobsProductionResource(filter: Signal<JobsUserPreferences['jobsProductionQuery'] | null>) {
    const params = computed(() => this.#savedQueryToRequest(filter()));
    return this.#api.getJobsProductionSummaryResource(params);
  }

  getSavedQuery(): Signal<JobsUserPreferences['jobsProductionQuery'] | null> {
    return computed(() => this.#preferencesService.userPreferences()?.jobsProductionQuery ?? null);
  }

  async setSavedQuery(jobsProductionQuery: JobsUserPreferences['jobsProductionQuery']) {
    return this.#preferencesService.patchUserPreferences({ jobsProductionQuery });
  }

  getReportURL(query: JobsUserPreferences['jobsProductionQuery'] | null): URL {
    notNullOrThrow(query);
    const url = new URL('/data/jobs/products/report', window.location.origin);
    const params = new URLSearchParams(this.#savedQueryToRequest(query));

    url.search = params.toString();
    return url;
  }

  #savedQueryToRequest(query: JobsUserPreferences['jobsProductionQuery'] | null): Record<string, any> | undefined {
    if (!query) {
      return undefined;
    }
    const params = pickNotNull(query) as Record<string, any>;
    if (query.fromDate) {
      params.fromDate = formatISO(query.fromDate, { representation: 'date' });
    }
    if (query.toDate) {
      params.toDate = formatISO(query.toDate, { representation: 'date' });
    }
    return params;
  }
}
