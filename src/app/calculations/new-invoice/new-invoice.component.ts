import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map, BehaviorSubject, combineLatest, merge, Observable, tap } from 'rxjs';
import { InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { JobPartial, JobUnwindedPartial } from 'src/app/jobs';
import { InvoicesTotals } from '../interfaces';
import { InvoicesService } from '../services/invoices.service';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewInvoiceComponent implements OnInit {

  @ViewChild(ScrollTopDirective) private scroll: ScrollTopDirective;


  private invoicesService = inject(InvoicesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chDetector = inject(ChangeDetectorRef);

  customerId = new FormControl<string>('');

  noInvoices$ = this.invoicesService.jobsWithoutInvoicesTotals$;

  jobs$: Observable<JobUnwindedPartial[]> = this.route.data.pipe(
    map(data => data.jobs || []),
    tap(() => this.scroll?.scrollToTop()),
  );


  selectedJobs: JobUnwindedPartial[] = [];


  get selection(): number[] {
    return this.selectedJobs.map(job => job.jobId);
  }

  get invoicesTotals(): InvoicesTotals {
    return jobTotalsFromJob(this.selectedJobs);
  }

  ngOnInit(): void {

    this.customerId.setValue(this.route.snapshot.queryParamMap.get('customer') || '');

    this.customerId.valueChanges
      .subscribe(customer => this.router.navigate(['.'], { relativeTo: this.route, queryParams: { customer } }));

  }

  onCreateInvoice() {
    this.invoicesService.createInvoice({ jobIds: this.selection, customerId: this.customerId.value })
      .subscribe(({ invoiceId }) => this.router.navigate(['calculations', 'plate-invoice', invoiceId]));
  }

  onPrintList() {
    const { totals, grandTotal } = this.invoicesTotals;
    const invoice: InvoiceForReport = {
      customer: this.customerId.value,
      createdDate: new Date(),
      jobs: this.selectedJobs,
      products: totals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
      invoiceId: '',
    };
    this.invoicesService.getReport(invoice).subscribe(data => {
      window.open(URL.createObjectURL(data), 'new');
    });
  }

  onJobSelected(selectedJobs: JobUnwindedPartial[]) {
    this.selectedJobs = selectedJobs;
    this.chDetector.detectChanges();
  }


}

function jobTotalsFromJob(jobs: JobUnwindedPartial[]): InvoicesTotals {
  const totM = new Map<string, ProductTotals>();
  for (const { products } of jobs) {
    if (!products) { continue; }
    const { name, price, count, units } = products;
    totM.set(
      name,
      {
        _id: name,
        units,
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

