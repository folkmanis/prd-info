import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { Customer, CustomerPartial, Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';
import { filter, map, pluck } from 'rxjs/operators';
import { InvoicesService } from '../services/invoices.service';
import { log } from 'prd-cdk';

@Component({
  selector: 'app-job-prices',
  templateUrl: './job-prices.component.html',
  styleUrls: ['./job-prices.component.scss']
})
export class JobPricesComponent implements OnInit {


  customers$ = this.invoicesService.jobsWithoutInvoicesTotals$.pipe(
    map(tot => tot.map(cust => cust._id)),
  );

  // DEBUG
  initialCustomer$: Observable<string> = this.route.firstChild.paramMap.pipe(
    map(params => params.get('customer')),
    filter(value => !!value),
    log('customer route'),
  );

  constructor(
    private jobService: JobService,
    private invoicesService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
  ) { }

  ngOnInit(): void {
  }

  onCustomerSelect(value: string | undefined) {
    const name = value ? value : 'all';
    console.log(name);
    this.router.navigate([name], { relativeTo: this.route });
  }

}
