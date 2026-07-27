import { inject, Service, Signal } from '@angular/core';
import { assertNotNull, FilterInput } from 'src/app/library';
import { ProductsService } from 'src/app/services';
import { JobCreate, JobFilter } from '../interfaces';
import { JobService } from '../services/job.service';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';

@Service()
export class QuickCreateService {
  #productsService = inject(ProductsService);
  #jobService = inject(JobService);
  #preferencesService = inject(JobsUserPreferencesService);

  productResource(id: Signal<string | undefined>) {
    return this.#productsService.getProductResource(id);
  }

  productsCustomerResource(name: Signal<string | undefined>) {
    return this.#productsService.productsCustomerResource(name);
  }

  jobsResource(filter: FilterInput<JobFilter | undefined>) {
    return this.#jobService.getJobsUnwindedResource(filter);
  }

  async saveJob(job: JobCreate) {
    const inserted = await this.#jobService.newJob(job);
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
