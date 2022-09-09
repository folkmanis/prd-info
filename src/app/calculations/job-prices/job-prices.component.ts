import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { merge, Observable, of } from 'rxjs';
import { map, mergeMap, pluck, take, takeUntil } from 'rxjs/operators';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { Filter, JobPricesService } from './job-prices.service';
import { omit } from 'lodash-es';

const updateMessage = (n: number) => `Izmainīti ${n} ieraksti.`;

@Component({
  selector: 'app-job-prices',
  templateUrl: './job-prices.component.html',
  styleUrls: ['./job-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    JobPricesService,
    DestroyService,
  ]
})
export class JobPricesComponent implements OnInit {

  filter: Filter = {
    name: '',
  };

  customers$: Observable<JobsWithoutInvoicesTotals[]> = this.jobPricesService.customers$;

  initialCustomer$: Observable<string> = this.jobPricesService.filter$.pipe(
    pluck('name'),
  );

  saveEnabled$: Observable<boolean> = merge(
    of(false),
    this.jobPricesService.jobUpdatesSelected$.pipe(
      map(upd => upd.length > 0)
    )
  );

  selectedCount$: Observable<number> = merge(
    of(0),
    this.jobPricesService.jobUpdatesSelected$.pipe(
      map(upd => upd.length)
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

  onSavePrices() {
    this.jobPricesService.jobUpdatesSelected$.pipe(
      take(1),
      mergeMap(jobs => jobs.length === 0 ? of(0) : this.jobPricesService.updateJobPrices(jobs)),
    ).subscribe(updates => this.snack.open(updateMessage(updates), 'OK', { duration: 3000 }));
  }

  private navigate() {
    this.router.navigate([this.filter.name, omit(this.filter, 'name')], { relativeTo: this.route });
  }


}
