import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';
import { filter, map, pluck, takeUntil } from 'rxjs/operators';
import { InvoicesService } from '../services/invoices.service';
import { log, DestroyService } from 'prd-cdk';
import { JobPricesResolverService, Filter } from '../services/job-prices-resolver.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-job-prices',
  templateUrl: './job-prices.component.html',
  styleUrls: ['./job-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class JobPricesComponent implements OnInit {

  filter = new Filter();

  customers$ = this.invoicesService.jobsWithoutInvoicesTotals$.pipe(
    map(tot => tot.map(cust => cust._id)),
  );

  initialCustomer$: Observable<string> = this.resolverService.filter$.pipe(
    pluck('name'),
  );
  noPrice$: Observable<boolean> = this.resolverService.filter$.pipe(
    pluck('noPrice'),
  );

  constructor(
    private invoicesService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private resolverService: JobPricesResolverService,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.resolverService.filter$.pipe(
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

  private navigate() {
    this.router.navigate([this.filter.name, this.filter], { relativeTo: this.route });
  }

}
