import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { pluck, filter, switchMap, map, toArray } from 'rxjs/operators';
import { JobPartial, JobProduct } from 'src/app/interfaces';
import { log } from 'prd-cdk';
import { Filter, JobPricesService, JobWithUpdate } from '../../services/job-prices.service';

const JOB_COLUMNS = ['jobId', 'custCode', 'name'] as const;
const PRODUCT_COLUMNS = ['name', 'price', 'count', 'units', 'total'] as const;
const PREFIX = 'products';
type Prefix<P extends string, T> = { [K in keyof T as `${P}.${string & K}`]: T[K] };
type JobData =
  Pick<JobPartial, typeof JOB_COLUMNS[number]>
  & Prefix<typeof PREFIX, Pick<JobProduct & { total: number; priceUpdate?: number; }, typeof PRODUCT_COLUMNS[number]>>;

const COLUMNS = [...JOB_COLUMNS, ...PRODUCT_COLUMNS.map(col => `${PREFIX}.${col}`)] as const;

@Component({
  selector: 'app-job-prices-table',
  templateUrl: './job-prices-table.component.html',
  styleUrls: ['./job-prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPricesTableComponent implements OnInit {

  displayedColumns = [...COLUMNS];

  jobs$: Observable<JobData[]> = this.jobPricesService.jobs$.pipe(
    switchMap(jobs => from(jobs).pipe(
      map(this.columnData),
      toArray(),
    )),
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPricesService: JobPricesService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => this.jobPricesService.loadJobs(new Filter(
      params.get('customer') || 'all',
      params.get('noPrice') === 'true',
      params.get('findPrices') === 'true',
    )));

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
