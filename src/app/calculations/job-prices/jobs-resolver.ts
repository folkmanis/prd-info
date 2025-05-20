import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CustomerProduct } from 'src/app/interfaces';
import { JobFilter, JobService, JobUnwindedPartial } from 'src/app/jobs';
import { ProductsService } from 'src/app/services/products.service';
import { JobData, JobWithUpdate } from './interfaces';

export const resolveJobData: ResolveFn<JobData[]> = async (route) => {
  const jobService = inject(JobService);
  const productsService = inject(ProductsService);
  const customer = route.queryParamMap.get('customer');

  let products: CustomerProduct[] = [];
  if (customer) {
    products = (await productsService.productsCustomer(customer)).filter((prod) => prod.price !== undefined);
  }

  const filterQuery: JobFilter = {
    invoice: 0,
  };
  if (customer) {
    filterQuery.customer = customer;
  }
  const jobs = await jobService.getJobListUnwinded(filterQuery);

  return jobs
    .filter((job) => !!job.products)
    .map((job) => addProductPrice(job, products))
    .map((job) => addColumnData(job));
};

function addProductPrice(job: JobUnwindedPartial, cProducts: CustomerProduct[]): JobWithUpdate {
  const product = job.products;
  if (cProducts.length === 0 && !product?.price) {
    return job;
  } else {
    return product && !product.price
      ? {
          ...job,
          'products.priceUpdate': cProducts.find((cp) => cp.productName === product.name)?.price,
        }
      : job;
  }
}

function addColumnData(job: JobWithUpdate): JobData {
  const products = job.products;
  const price = products?.price || 0;
  const count = products?.count || 0;
  return {
    ...job,
    'products.name': products?.name || '',
    'products.price': price,
    'products.count': count,
    'products.total': (job?.['products.priceUpdate'] !== undefined ? job?.['products.priceUpdate'] : price) * count,
    'products.units': products?.units || '',
  };
}
