import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, tap, take, shareReplay, share, takeUntil } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter, Job, JobBase, JobPartial, ProductTotals, Invoice, InvoiceForReport } from 'src/app/interfaces';
import { CustomersService, PrdApiService } from 'src/app/services';
import { InvoicesService } from '../../services/invoices.service';
import { JobService } from 'src/app/services/job.service';
import { InvoiceReport } from '../invoice-editor/invoice-report';
import { InvoicesTotals } from '../interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class NewInvoiceComponent implements OnInit {
  constructor(
    private invoiceService: InvoicesService,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private destroy$: DestroyService,
  ) { }

  selectedJobs: number[] | undefined;
  canSubmit = false;
  customerId = new FormControl('');

  customers$: Observable<string[]> = this.invoiceService.jobsWithoutInvoicesTotals$.pipe(
    map(custs => custs.map(cust => cust._id))
  );

  jobs$ = this.jobService.jobs$;
  totals$: Observable<InvoicesTotals> = combineLatest([
    this.invoiceService.totals$,
    this.invoiceService.grandTotal$,
  ]).pipe(
    map(([totals, grandTotal]) => ({ totals, grandTotal })),
    share(),
  );


  ngOnInit(): void {
    this.customerId.valueChanges.pipe(
      startWith(''),
      takeUntil(this.destroy$),
    )
      .subscribe(customer => this.jobService.setFilter({ customer, unwindProducts: 1, invoice: 0 }));
  }

  onCreateInvoice() {
    this.invoiceService.createInvoice({ selectedJobs: this.selectedJobs, customerId: this.customerId.value })
      .subscribe(id => this.router.navigate(['../invoice', { invoiceId: id.invoiceId }], { relativeTo: this.route }));
  }

  onPrintList(jobs: JobBase[], customer: string, { totals, grandTotal }: InvoicesTotals) {
    const invoice: InvoiceForReport = {
      customer,
      createdDate: new Date(Date.now()),
      jobs: jobs.filter(job => this.selectedJobs.some(id => id === job.jobId)),
      products: totals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
      invoiceId: '',
    };
    const report = new InvoiceReport(invoice);
    report.open();
  }

  onJobSelected(selectedJobs: number[]) {
    this.selectedJobs = selectedJobs;
    this.invoiceService.totalsFilter$.next(selectedJobs);
    this.canSubmit = !!selectedJobs.length;
  }

}
