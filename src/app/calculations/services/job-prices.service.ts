import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter, JobProduct, CustomerProduct, JobsWithoutInvoicesTotals } from 'src/app/interfaces';
import { Observable, EMPTY, ReplaySubject, BehaviorSubject, Subject, merge, of, combineLatest, from } from 'rxjs';
import { tap, map, take, withLatestFrom, switchMap, shareReplay, toArray, concatMap, filter } from 'rxjs/operators';
import { log, omit } from 'prd-cdk';
import { JobService } from 'src/app/services/job.service';
import { CustomersService } from 'src/app/services/customers.service';
import { ProductsService } from 'src/app/services/products.service';
import { InvoicesService } from './invoices.service';
import { SelectionModel } from '@angular/cdk/collections';

export interface Filter {
  name: string;
  noPrice: boolean;
  findPrices: boolean;
}

type JobPartialUnwinded = JobPartial & {
  products: JobProduct;
  productsIdx: number;
};

type JobWithUpdate = JobPartialUnwinded & {
  'products.priceUpdate'?: number;
};

const JOB_COLUMNS = ['jobId', 'custCode', 'name'] as const;
const PRODUCT_COLUMNS = ['name', 'price', 'count', 'units', 'total'] as const;
const PREFIX = 'products';
type Prefix<P extends string, T> = { [K in keyof T as `${P}.${string & K}`]: T[K] };

export type JobData =
  Pick<JobWithUpdate, (typeof JOB_COLUMNS[number]) | 'products' | 'productsIdx' | 'customer'>
  & Prefix<typeof PREFIX, Pick<JobProduct & { total: number; priceUpdate?: number; }, typeof PRODUCT_COLUMNS[number]>>;

export const COLUMNS = ['selection', ...JOB_COLUMNS, ...PRODUCT_COLUMNS.map(col => `${PREFIX}.${col}`)];

type JobUpdateFields = Pick<Job, 'jobId' | 'productsIdx' | 'products'>;

@Injectable({
  providedIn: 'any'
})
export class JobPricesService {

  private readonly _filter$ = new ReplaySubject<Filter>(1);
  filter$ = this._filter$.asObservable();

  selection = new SelectionModel<JobData>(true, [], true);

  private readonly _reload$ = new Subject<unknown>();

  jobs$: Observable<JobData[]> = merge(of(''), this._reload$).pipe(
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
    switchMap(jobs => from(jobs).pipe(
      map(this.columnData),
      toArray(),
    )),
    log('after price update'),
    shareReplay(1),
  );

  jobsUpdated$: Observable<JobData[]> = this.jobs$.pipe(
    map(jobs => jobs.filter(job => job['products.priceUpdate'] !== undefined)),
  );

  jobUpdatesSelected$: Observable<JobUpdateFields[]> = this.selection.changed.pipe(
    map(({ source }) => source.selected.map(job => this.jobUpdateFields(job))),
    log('update'),
    shareReplay(1),
  );

  constructor(
    private jobService: JobService,
    private invoicesService: InvoicesService,
    private productsService: ProductsService,
  ) { }

  getCustomers(): Observable<string[]> {
    return this.invoicesService.getJobsWithoutInvoicesTotals().pipe(
      map(tot => tot.map(cust => cust._id)),
    );
  }

  loadJobs(filter: Filter) {
    this._filter$.next(filter);
  }

  reload() {
    this._reload$.next('');
  }

  saveJobs(jobs: JobUpdateFields[]): Observable<number> {
    return this.jobService.updateJobs(jobs);
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

  private jobUpdateFields(job: Pick<JobWithUpdate, 'jobId' | 'productsIdx' | 'products' | 'products.priceUpdate'>): JobUpdateFields {
    return {
      jobId: job.jobId,
      productsIdx: job.productsIdx,
      products: {
        ...job.products,
        price: job['products.priceUpdate']
      },
    };
  }

  private columnData(job: JobWithUpdate): JobData {
    const product = job.products as JobProduct;
    return {
      ...job,
      'products.name': product?.name || '',
      'products.price': product?.price || 0,
      'products.count': product?.count || 0,
      'products.total': (job['products.priceUpdate'] !== undefined ? job['products.priceUpdate'] : product?.price) * product?.count,
      'products.units': product?.units || '',
    };
  }


}
