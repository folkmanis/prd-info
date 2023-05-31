import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { Observable, Subject, combineLatest, map, takeUntil, withLatestFrom } from 'rxjs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { COLUMNS, COLUMNS_SMALL, JobData, JobPricesService } from '../job-prices.service';


@Component({
  selector: 'app-job-prices-table',
  standalone: true,
  templateUrl: './job-prices-table.component.html',
  styleUrls: ['./job-prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
  ],
  imports: [
    MatTableModule,
    ScrollTopDirective,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe,
    AsyncPipe,
    ViewSizeModule,
  ]
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
