import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { log } from 'prd-cdk';
import { EMPTY, from, merge, Observable, of, pipe, ReplaySubject, Subject, OperatorFunction, ObservedValueOf } from 'rxjs';
import { filter as filterOperator, map, shareReplay, switchMap, tap, toArray, withLatestFrom } from 'rxjs/operators';
import { CustomerProduct, Job, JobPartial, JobProduct, JobsWithoutInvoicesTotals } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { ProductsService } from 'src/app/services/products.service';
import { InvoicesService } from '../services/invoices.service';

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
    ),
    map((prods: CustomerProduct[]) => prods.filter(prod => prod.price !== undefined)),
  );

  jobs$: Observable<JobData[]> = merge(
    this._reload$,
    this._filter$,
  ).pipe(
    this.getJobs(), // cache filter input and retrieve jobs
    withLatestFrom(this._customerProducts$),
    map(([jobs, products]) => jobs
      .map(job => this.updateJobs(job, products))
      .map(job => this.columnData(job))
    ),
    shareReplay(1),
  );

  jobsUpdated$: Observable<JobData[]> = this.jobs$.pipe(
    map(jobs => jobs.filter(job => job['products.priceUpdate'] !== undefined)),
  );

  jobUpdatesSelected$: Observable<JobUpdateFields[]> = this.selection.changed.pipe(
    map(({ source }) => source.selected.map(job => this.jobUpdateFields(job))),
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

  private getJobs(): OperatorFunction<Filter | unknown, JobPartialUnwinded[] | never> {
    let fl: Filter | undefined;

    return pipe(
      tap((filter: Filter) => {
        if (typeof filter === 'object' && 'name' in filter) { fl = filter; }
        console.log(fl);
      }),
      filterOperator(_ => !!fl),
      switchMap(_ => this.jobService.getJobList({
        invoice: 0,
        unwindProducts: 1,
        customer: fl.name === 'all' ? undefined : fl.name
      }) as Observable<JobPartialUnwinded[]>)
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
