import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, tap, take, shareReplay } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter, JobPartial, ProductTotals, InvoiceLike } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { InvoicesService } from '../../services/invoices.service';
import { JobService } from '../../services/job.service';
import { InvoiceReport } from '../invoice-editor/invoice-report';

export interface InvoicesTotals {
  totals: ProductTotals[];
  grandTotal: number;
}

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css']
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  constructor(
    private invoiceService: InvoicesService,
    private customersService: CustomersService,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  selectedJobs: number[] | undefined;
  canSubmit = false;
  customerId = new FormControl('');

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  jobs$ = this.jobService.jobs$;
  totals$: Observable<InvoicesTotals> = combineLatest([
    this.invoiceService.totals$,
    this.invoiceService.grandTotal$.pipe(tap(console.log)),
  ]).pipe(
    map(([totals, grandTotal]) => ({ totals, grandTotal })),
  );

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    const _subs = this.customerId.valueChanges.pipe(
      startWith(''),
      map((customer: string) => ({ customer, unwindProducts: 1, invoice: 0 } as JobQueryFilter)),
    )
      .subscribe(this.jobService.filter$);
    this.subscriptions.add(_subs);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCreateInvoice() {
    this.invoiceService.createInvoice({ selectedJobs: this.selectedJobs, customerId: this.customerId.value })
      .subscribe(id => this.router.navigate(['../invoice', { invoiceId: id.invoiceId }], { relativeTo: this.route }));
  }

  onPrintList(jobs: JobPartial[], customer: string, { totals, grandTotal }: InvoicesTotals) {
    const invoice: InvoiceLike = {
      customer,
      createdDate: new Date(Date.now()),
      jobs: jobs.filter(job => this.selectedJobs.some(id => id === job.jobId)),
      products: totals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
    };
    console.log(invoice);
    const report = new InvoiceReport(invoice);
    report.open();
  }

  onJobSelected(selectedJobs: number[]) {
    this.selectedJobs = selectedJobs;
    this.invoiceService.totalsFilter$.next(selectedJobs);
    setTimeout(() => {
      this.canSubmit = !!selectedJobs.length;
    }, 0);
  }

}
