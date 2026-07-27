import { Service, Signal, computed, inject } from '@angular/core';
import { JobsProductionFilter, JobsProductionFilterSchema } from '../../interfaces';
import { SavedJobsProductionFilter } from '../../interfaces/jobs-user-preferences';
import { JobsApiService } from '../../services/jobs-api.service';
import { JobsUserPreferencesService } from '../../services/jobs-user-preferences.service';

@Service()
export class ProductsProductionService {
  #preferencesService = inject(JobsUserPreferencesService);
  #api = inject(JobsApiService);

  getJobsProductionResource(filter: Signal<JobsProductionFilter | undefined>) {
    return this.#api.getJobsProductionSummaryResource(filter);
  }

  getSavedQuery(): Signal<SavedJobsProductionFilter | undefined> {
    return computed(() => this.#preferencesService.userPreferences()?.jobsProductionQuery);
  }

  async setSavedQuery(jobsProductionQuery: SavedJobsProductionFilter) {
    await this.#preferencesService.patchUserPreferences({ jobsProductionQuery });
  }

  getReportURL(filter: SavedJobsProductionFilter): URL {
    const url = new URL('/data/jobs/products/report', window.location.origin);
    const params = new URLSearchParams(JobsProductionFilterSchema.encode(filter));

    url.search = params.toString();
    return url;
  }
}
