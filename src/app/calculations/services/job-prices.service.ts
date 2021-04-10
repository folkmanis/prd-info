import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter, JobProduct, CustomerProduct } from 'src/app/interfaces';
import { Observable, EMPTY, ReplaySubject, BehaviorSubject, Subject, merge, of, combineLatest, from } from 'rxjs';
import { tap, map, take, withLatestFrom, switchMap, shareReplay, toArray, concatMap, filter } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { JobService } from 'src/app/services/job.service';
import { CustomersService } from 'src/app/services/customers.service';
import { ProductsService } from 'src/app/services/products.service';
import { InvoicesService } from './invoices.service';

export class Filter {
  constructor(
    public name: string = '',
    public noPrice: boolean = false,
    public findPrices: boolean = false,
  ) { }

  get routeParams(): Pick<Filter, 'noPrice' | 'findPrices'> {
    return {
      noPrice: this.noPrice,
      findPrices: this.findPrices,
    };
  }
}

type JobUpdateFields = Pick<Job, 'jobId' | 'productsIdx'| 'products'>;

export type JobPartialUnwinded = JobPartial & {
  products: JobProduct;
  productsIdx: number;
};

export type JobWithUpdate = JobPartialUnwinded & {
  'products.priceUpdate'?: number;
};

@Injectable({
  providedIn: 'any'
})
export class JobPricesService {

  private readonly _filter$ = new ReplaySubject<Filter>(1);
  filter$ = this._filter$.asObservable();

  private readonly _reload$ = new Subject<unknown>();

  customers$ = this.invoicesService.getJobsWithoutInvoicesTotals().pipe(
    map(tot => tot.map(cust => cust._id)),
  );

  jobs$ = merge(of(''), this._reload$).pipe(
    switchMap(_ =>
      this._filter$.pipe(
        switchMap(filter => combineLatest([
          this.jobService.getJobList({
            invoice: 0,
            unwindProducts: 1,
            customer: filter.name === 'all' ? undefined : filter.name
          }).pipe(
            map((jobs: JobPartialUnwinded[]) => this.filterJobs(jobs, filter)),
          ),
          filter.findPrices ? this.productsService.productsCustomer(filter.name) : of([]),
        ])),
      )
    )
  ).pipe(
    switchMap(([jobs, filter]) => from(jobs).pipe(
      map(job => this.updateJobs(job, filter)),
      toArray(),
    )),
    log('after price update'),
    shareReplay(1),
  );

  jobUpdates$: Observable<JobUpdateFields[]> = this.jobs$.pipe(
    concatMap(jobs => from(jobs).pipe(
      filter(job => job['products.priceUpdate'] !== undefined),
      map(job => this.jobUpdateFields(job)),
      toArray(),
    )),
    log('update'),
  );

  constructor(
    private jobService: JobService,
    private invoicesService: InvoicesService,
    private productsService: ProductsService,
  ) { }

  loadJobs(filter: Filter) {
    this._filter$.next(filter);
  }

  reload() {
    this._reload$.next('');
  }

  saveJobs(jobs: JobUpdateFields[]): Observable<number> {
   return this.jobService.updateJobs(jobs)
  }

  private filterJobs(jobs: JobPartialUnwinded[], filter: Filter): JobPartialUnwinded[] {
    return filter.noPrice ? jobs.filter(jb => !jb.products?.price) : jobs;
  }

  private updateJobs(job: JobPartialUnwinded, cProducts: CustomerProduct[]): JobWithUpdate {
    if (cProducts.length === 0) { return job; }

    const product = job.products;
    return product && !product.price ? {
      ...job,
      'products.priceUpdate': cProducts.find(cp => cp.productName === product.name)?.price,
    } : job;
  }

  private jobUpdateFields(job: JobWithUpdate): JobUpdateFields {
    return {
      jobId: job.jobId,
      productsIdx: job.productsIdx,
      products: {
        ...job.products,
        price: job['products.priceUpdate']
      },
    };
  }

}
