import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { pluck, filter, switchMap, map, toArray, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import { JobPartial, JobProduct } from 'src/app/interfaces';
import { log, DestroyService } from 'prd-cdk';
import { Filter, JobPricesService, COLUMNS, COLUMNS_SMALL, JobData } from '../job-prices.service';
import { LayoutService } from 'src/app/services';

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

  isLarge$: Observable<boolean> = this.layout.isLarge$;

  displayedColumns$: Observable<string[]> = this.layout.isSmall$.pipe(
    map(small => small ? COLUMNS_SMALL : COLUMNS),
  );

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
    private layout: LayoutService,
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
