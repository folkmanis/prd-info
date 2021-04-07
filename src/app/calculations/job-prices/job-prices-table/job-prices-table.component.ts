import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { pluck, filter, switchMap, map, toArray } from 'rxjs/operators';
import { JobPartial, JobProduct } from 'src/app/interfaces';
import { log } from 'prd-cdk';

const JOB_COLUMNS = ['jobId', 'custCode', 'name'] as const;
const PRODUCT_COLUMNS = ['name', 'price', 'count', 'units', 'total'] as const;
const PREFIX = 'products';
type Prefix<P extends string, T> = { [K in keyof T as `${P}.${string & K}`]: T[K] };
type JobData =
  Pick<JobPartial, typeof JOB_COLUMNS[number]>
  & Prefix<typeof PREFIX, Pick<JobProduct & { total: number; }, typeof PRODUCT_COLUMNS[number]>>;

const COLUMNS = [...JOB_COLUMNS, ...PRODUCT_COLUMNS.map(col => `${PREFIX}.${col}`)] as const;

@Component({
  selector: 'app-job-prices-table',
  templateUrl: './job-prices-table.component.html',
  styleUrls: ['./job-prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPricesTableComponent implements OnInit {

  displayedColumns = [...COLUMNS];

  jobs$: Observable<JobData[]> = this.route.data.pipe(
    pluck('jobs'),
    filter(jobs => !!jobs),
    switchMap(jobs => from(jobs).pipe(
      map(this.columnData),
      toArray(),
    )),
    log('jobs table'),
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  private columnData(job: JobPartial): JobData {
    const product = job.products as JobProduct;
    return {
      ...job,
      'products.name': product?.name || '',
      'products.price': product?.price || 0,
      'products.count': product?.count || 0,
      'products.total': product ? product.price * product.count : 0,
      'products.units': product?.units || '',
    };
  }

}
