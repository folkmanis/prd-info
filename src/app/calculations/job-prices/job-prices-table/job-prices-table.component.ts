import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { pluck, filter, switchMap, map, toArray, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import { JobPartial, JobProduct } from 'src/app/interfaces';
import { log, DestroyService } from 'prd-cdk';
import { Filter, JobPricesService, COLUMNS, JobData } from '..//job-prices.service';

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

  displayedColumns = [...COLUMNS];

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


}
