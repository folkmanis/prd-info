import { inject, Injectable, Signal } from '@angular/core';
import { ProductsService } from 'src/app/services';
import { JobsApiService } from '../services/jobs-api.service';
import { JobCreate, JobFilter } from '../interfaces';
import { FilterInput } from 'src/app/library';
import { filterInputToRequestQuery } from '../services/job.service';

@Injectable({
  providedIn: 'root',
})
export class QuickCreateService {
  #productsService = inject(ProductsService);
  #jobsApi = inject(JobsApiService);

  productResource(id: Signal<string | undefined>) {
    return this.#productsService.getProductResource(id);
  }

  productsCustomerResource(name: Signal<string | undefined>) {
    return this.#productsService.productsCustomerResource(name);
  }

  jobsResource(filter: FilterInput<JobFilter>) {
    return this.#jobsApi.jobsUnwindedResource(filterInputToRequestQuery(filter));
  }

  saveJob(job: JobCreate) {
    return this.#jobsApi.insertOne(job, {});
  }
}
