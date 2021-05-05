import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription, combineLatest, merge } from 'rxjs';
import { map, startWith, tap, take, shareReplay, share, takeUntil, switchMap } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter, Job, JobBase, JobPartial, ProductTotals, Invoice, InvoiceForReport, JobsWithoutInvoicesTotals, JobProduct } from 'src/app/interfaces';
import { CustomersService, PrdApiService } from 'src/app/services';
import { InvoicesService } from '../services/invoices.service';
import { JobService } from 'src/app/services/job.service';
import { InvoiceReport } from '../services/invoice-report';
import { InvoicesTotals } from '../interfaces';
import { DestroyService } from 'prd-cdk';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewInvoiceComponent implements OnInit {


  isSmall$ = this.layoutService.isSmall$;

  noInvoices$ = this.invoicesService.jobsWithoutInvoicesTotals$.pipe(
    shareReplay(1),
  );

  jobs$: Observable<JobPartial[]>;
  selectedJobs$: Observable<JobPartial[]>;

  selection$ = new BehaviorSubject<number[]>([]);

  invoicesTotals$: Observable<InvoicesTotals>;

  customerId = new FormControl('');

  constructor(
    private invoicesService: InvoicesService,
    private layoutService: LayoutService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.jobs$ = this.customerId.valueChanges.pipe(
      startWith(''),
      switchMap(customer => this.invoicesService.getJobs({ customer, unwindProducts: 1, invoice: 0 })),
      share(),
    );

    this.selectedJobs$ = combineLatest([
      this.jobs$,
      this.selection$,
    ]).pipe(
      map(([jobs, sel]) => this.filterJobs(jobs, sel))
    );

    this.invoicesTotals$ = merge(
      this.jobs$,
      this.selectedJobs$,
    ).pipe(
      map(this.jobTotals),
      share(),
    );

  }

  onCreateInvoice() {
    this.invoicesService.createInvoice({ selectedJobs: this.selection$.value, customerId: this.customerId.value })
      .subscribe(({ invoiceId }) => this.router.navigate(['calculations', 'plate-invoice', invoiceId]));
  }

  onPrintList(jobs: JobBase[]) {
    const { totals, grandTotal } = this.jobTotals(jobs);
    const invoice: InvoiceForReport = {
      customer: this.customerId.value,
      createdDate: new Date(),
      jobs,
      products: totals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
      invoiceId: '',
    };
    const report = new InvoiceReport(invoice);
    report.open();
  }

  onJobSelected(selectedJobs: number[]) {
    this.selection$.next(selectedJobs);
  }

  private filterJobs(jobs: JobPartial[], sel: number[]): JobPartial[] {
    return jobs.filter(job => sel.some(num => num === job.jobId));
  }

  private jobTotals(jobs: JobPartial[]): InvoicesTotals {
    const totM = new Map<string, ProductTotals>();
    for (const { products } of jobs) {
      if (!products) { continue; }
      const { name, price, count } = products as JobProduct;
      totM.set(
        name,
        {
          _id: name,
          count: (totM.get(name)?.count || 0) + count,
          total: (totM.get(name)?.total || 0) + price * count
        }
      );
    }
    const totals = [...totM.values()].sort((a, b) => a._id > b._id ? 1 : -1);
    return {
      totals,
      grandTotal: totals.reduce((acc, curr) => acc + curr.total, 0),
    };
  }


}
