import { inject, Injectable, Signal } from '@angular/core';
import { assertNotNull, FilterInput } from 'src/app/library';
import { ProductsService } from 'src/app/services';
import { JobCreate, JobFilter } from '../interfaces';
import { filterInputToRequestQuery } from '../services/job.service';
import { JobsApiService } from '../services/jobs-api.service';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';

@Injectable({
  providedIn: 'root',
})
export class QuickCreateService {
  #productsService = inject(ProductsService);
  #jobsApi = inject(JobsApiService);
  #preferencesService = inject(JobsUserPreferencesService);

  productResource(id: Signal<string | undefined>) {
    return this.#productsService.getProductResource(id);
  }

  productsCustomerResource(name: Signal<string | undefined>) {
    return this.#productsService.productsCustomerResource(name);
  }

  jobsResource(filter: FilterInput<JobFilter | undefined>) {
    return this.#jobsApi.jobsUnwindedResource(filterInputToRequestQuery(filter));
  }

  async saveJob(job: JobCreate) {
    const inserted = await this.#jobsApi.insertOne(job, {});
    this.#updatePreferences(job);
    return inserted;
  }

  async #updatePreferences(job: JobCreate) {
    const preferences = this.#preferencesService.userPreferences();
    assertNotNull(preferences);
    const {
      quickCreateJob: { customerName, productName },
    } = preferences;
    if (job.customer !== customerName || job.products[0].name !== productName) {
      return this.#preferencesService.patchUserPreferences({
        quickCreateJob: {
          customerName: job.customer,
          productName: job.products[0].name,
        },
      });
    }
  }
}
