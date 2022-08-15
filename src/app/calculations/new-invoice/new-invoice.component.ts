import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { map, share, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { JobUnwindedPartial } from 'src/app/jobs';
import { InvoicesTotals } from '../interfaces';
import { InvoicesService } from '../services/invoices.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewInvoiceComponent implements OnInit {


  noInvoices$ = this.invoicesService.jobsWithoutInvoicesTotals$.pipe(
    shareReplay(1),
  );

  jobs$: Observable<JobUnwindedPartial[]>;
  selectedJobs$: Observable<JobUnwindedPartial[]>;

  selection$ = new BehaviorSubject<number[]>([]);

  invoicesTotals$: Observable<InvoicesTotals>;

  customerId = new UntypedFormControl('');

  constructor(
    private invoicesService: InvoicesService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.jobs$ = this.customerId.valueChanges.pipe(
      startWith(''),
      switchMap(customer => this.invoicesService.getJobsUnwinded({ customer, invoice: 0, limit: 1000 })),
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
    this.invoicesService.createInvoice({ jobIds: this.selection$.value, customerId: this.customerId.value })
      .subscribe(({ invoiceId }) => this.router.navigate(['calculations', 'plate-invoice', invoiceId]));
  }

  onPrintList(jobs: JobUnwindedPartial[]) {
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

function jobTotalsFromJob(jobs: JobUnwindedPartial[]): InvoicesTotals {
  const totM = new Map<string, ProductTotals>();
  for (const { products } of jobs) {
    if (!products) { continue; }
    const { name, price, count } = products;
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

function filterSelectedJobs([jobs, sel]: [JobUnwindedPartial[], number[]]): JobUnwindedPartial[] {
  return jobs.filter(job => sel.some(num => num === job.jobId));
}
