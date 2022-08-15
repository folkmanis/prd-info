import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { combineLatest, map, Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { COLUMNS, COLUMNS_SMALL, JobData, JobPricesService } from '../job-prices.service';


@Component({
  selector: 'app-job-prices-table',
  templateUrl: './job-prices-table.component.html',
  styleUrls: ['./job-prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
  ],
})
export class JobPricesTableComponent implements OnInit, OnDestroy {


  col = COLUMNS;
  colSmall = COLUMNS_SMALL;

  jobs$: Observable<JobData[]> = this.jobPricesService.jobs$;

  selection = this.jobPricesService.selection;

  checkAll$ = new Subject<boolean>();

  allSelected$: Observable<boolean> = combineLatest([
    this.jobPricesService.jobUpdatesSelected$,
    this.jobPricesService.jobsUpdated$,
  ]).pipe(map(([selected, updated]) => selected.length > 0 && selected.length === updated.length));

  partSelected$: Observable<boolean> = combineLatest([
    this.jobPricesService.jobUpdatesSelected$,
    this.jobPricesService.jobsUpdated$,
  ]).pipe(
    map(([selected, updated]) => selected.length > 0 && selected.length !== updated.length)
  );

  updatedCount$: Observable<number> = this.jobPricesService.jobsUpdated$.pipe(
    map(jobs => jobs.length)
  );

  constructor(
    private route: ActivatedRoute,
    private jobPricesService: JobPricesService,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => this.jobPricesService.loadJobs({
      name: params.get('customer') || 'all',
    }));

    this.jobPricesService.jobs$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(_ => this.selection.clear());

    this.checkAll$.pipe(
      withLatestFrom(this.jobPricesService.jobsUpdated$),
      takeUntil(this.destroy$),
    ).subscribe(([checked, jobs]) => checked ? this.selection.select(...jobs) : this.selection.clear());

  }

  ngOnDestroy() {
    this.checkAll$.complete();
  }

  trackByFn(_: number, item: JobData) {
    const id = `${item.jobId}-${item.productsIdx}`;
    return id;
  }


}
