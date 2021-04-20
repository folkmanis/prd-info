import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter, JobProduct, CustomerProduct, JobsWithoutInvoicesTotals } from 'src/app/interfaces';
import { Observable, EMPTY, ReplaySubject, BehaviorSubject, Subject, merge, of, combineLatest, from } from 'rxjs';
import { tap, map, take, withLatestFrom, switchMap, shareReplay, toArray, concatMap, filter, startWith, finalize, share } from 'rxjs/operators';
import { log, omit } from 'prd-cdk';
import { JobService } from 'src/app/services/job.service';
import { CustomersService } from 'src/app/services/customers.service';
import { ProductsService } from 'src/app/services/products.service';
import { InvoicesService } from '../services/invoices.service';
import { SelectionModel } from '@angular/cdk/collections';

export interface Filter {
  name: string;
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

@Injectable()
export class JobPricesService {

  private readonly _filter$ = new ReplaySubject<Filter>(1);
  filter$ = this._filter$.asObservable();

  selection = new SelectionModel<JobData>(true, [], true);

  private readonly _reload$ = new Subject<unknown>();

  private _customerProducts$: Observable<CustomerProduct[]> = this._filter$.pipe(
    switchMap(filter =>
      filter.name === 'all' ? of([]) : this.productsService.productsCustomer(filter.name),
    )
  );

  jobs$: Observable<JobData[]> = merge(of(''), this._reload$).pipe(
    switchMap(_ =>
      this._filter$.pipe(
        switchMap(filter => this.jobService.getJobList({
          invoice: 0,
          unwindProducts: 1,
          customer: filter.name === 'all' ? undefined : filter.name
        }).pipe(
          map(jobs => jobs as JobPartialUnwinded[])
        ),
        ),
      )
    )
  ).pipe(
    withLatestFrom(this._customerProducts$),
    switchMap(([jobs, products]) => from(jobs).pipe(
      map(job => this.updateJobs(job, products)),
      map(job => this.columnData(job)),
      toArray(),
    )),
    shareReplay(1),
  );

  jobsUpdated$: Observable<JobData[]> = this.jobs$.pipe(
    map(jobs => jobs.filter(job => job['products.priceUpdate'] !== undefined)),
    log('jobs'),
    // share(),
  );

  jobUpdatesSelected$: Observable<JobUpdateFields[]> = this.selection.changed.pipe(
    map(({ source }) => source.selected.map(job => this.jobUpdateFields(job))),
    // log('update'),
    shareReplay(1),
  );

  customers$: Observable<JobsWithoutInvoicesTotals[]> = merge(
    of(''),
    this._reload$
  ).pipe(
    switchMap(_ => this.invoicesService.getJobsWithoutInvoicesTotals()),
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
    return this.jobService.updateJobs(jobs).pipe(
      tap(_ => this.reload()),
    );
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
    const product = job.products;
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
