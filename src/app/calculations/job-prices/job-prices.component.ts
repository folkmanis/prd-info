import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, merge, Observable, of } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { Customer, CustomerPartial, Job, JobPartial, JobProduct, JobQueryFilter } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';
import { concatMap, filter, map, mergeMap, pluck, take, takeUntil, toArray } from 'rxjs/operators';
import { InvoicesService } from '../services/invoices.service';
import { log, DestroyService } from 'prd-cdk';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { JobPricesService, Filter } from '../services/job-prices.service';
import { MatSnackBar } from '@angular/material/snack-bar';

const updateMessage = (n: number) => `Izmainīti ${n} ieraksti.`;

@Component({
  selector: 'app-job-prices',
  templateUrl: './job-prices.component.html',
  styleUrls: ['./job-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class JobPricesComponent implements OnInit {

  filter = new Filter();

  customers$ = this.jobPricesService.customers$;

  initialCustomer$: Observable<string> = this.jobPricesService.filter$.pipe(
    pluck('name'),
  );
  noPrice$: Observable<boolean> = this.jobPricesService.filter$.pipe(
    pluck('noPrice'),
  );
  findPrices$: Observable<boolean> = this.jobPricesService.filter$.pipe(
    pluck('findPrices'),
  );

  saveEnabled$: Observable<boolean> = merge(
    of(false),
    this.jobPricesService.jobUpdates$.pipe(
      map(upd => upd.length > 0)
    )
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobPricesService: JobPricesService,
    private destroy$: DestroyService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.jobPricesService.filter$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(fltr => this.filter = fltr);
  }

  onCustomerSelect(value: string | undefined) {
    this.filter.name = value ? value : 'all';
    this.navigate();
  }

  onPriceFilterChecked(ev: MatCheckboxChange) {
    this.filter.noPrice = ev.checked;
    this.navigate();
  }

  onUpdatePrices(ev: MatCheckboxChange) {
    this.filter.findPrices = ev.checked;
    this.navigate();
  }

  onSavePrices() {
    this.jobPricesService.jobUpdates$.pipe(
      take(1),
      mergeMap(jobs => jobs.length === 0 ? of(0) : this.jobPricesService.saveJobs(jobs)),
      map(updates => this.snack.open(updateMessage(updates), 'OK', { duration: 3000 }))
    ).subscribe(_ => this.jobPricesService.reload());
  }

  private navigate() {
    this.router.navigate([this.filter.name, this.filter.routeParams], { relativeTo: this.route });
  }

  private isJobsWithoutPrice(jobs: JobPartial[]): boolean {
    if (jobs.length === 0) { return false; }

    return jobs.reduce((acc, curr) => acc || curr.products && !(curr.products instanceof Array) && !curr.products.price, false);
  }

}
