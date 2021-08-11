import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { map, share, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { InvoiceForReport, JobBase, JobPartial, JobProduct, ProductTotals } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { InvoicesTotals } from '../interfaces';
import { InvoicesService } from '../services/invoices.service';

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
      map(filterSelectedJobs)
    );

    this.invoicesTotals$ = merge(
      this.jobs$,
      this.selectedJobs$,
    ).pipe(
      map(jobTotalsFromJob),
      share(),
    );

  }

  onCreateInvoice() {
    this.invoicesService.createInvoice({ selectedJobs: this.selection$.value, customerId: this.customerId.value })
      .subscribe(({ invoiceId }) => this.router.navigate(['calculations', 'plate-invoice', invoiceId]));
  }

  onPrintList(jobs: JobBase[]) {
    const { totals, grandTotal } = jobTotalsFromJob(jobs);
    const invoice: InvoiceForReport = {
      customer: this.customerId.value,
      createdDate: new Date(),
      jobs,
      products: totals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
      invoiceId: '',
    };
    this.invoicesService.getReport(invoice).subscribe(data => {
      window.open(URL.createObjectURL(data), 'new');
    });
  }

  onJobSelected(selectedJobs: number[]) {
    this.selection$.next(selectedJobs);
  }

}

function jobTotalsFromJob(jobs: JobPartial[]): InvoicesTotals {
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

function filterSelectedJobs([jobs, sel]: [JobPartial[], number[]]): JobPartial[] {
  return jobs.filter(job => sel.some(num => num === job.jobId));
}
