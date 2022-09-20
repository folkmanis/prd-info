import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { JobUnwindedPartial } from 'src/app/jobs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { InvoicesTotals } from '../interfaces';
import { InvoicesService } from '../services/invoices.service';

export abstract class InvoiceCustomerSelector {
  abstract setCustomer(id: string): void;
}

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: InvoiceCustomerSelector,
    useExisting: NewInvoiceComponent,
  }]
})
export class NewInvoiceComponent implements OnInit, InvoiceCustomerSelector {

  @ViewChild(ScrollTopDirective) private scroll: ScrollTopDirective;

  customerId = new FormControl<string>('');

  noInvoices$ = this.invoicesService.jobsWithoutInvoicesTotals$;

  jobs$: Observable<JobUnwindedPartial[]> = this.route.data.pipe(
    map(data => data.jobs || []),
    tap(jobs => this.selectedJobs = jobs),
    tap(() => this.scroll?.scrollToTop()),
  );


  selectedJobs: JobUnwindedPartial[] = [];

  get selection(): number[] {
    return this.selectedJobs.map(job => job.jobId);
  }

  get invoicesTotals(): InvoicesTotals {
    return this.jobTotalsFromJob(this.selectedJobs);
  }

  constructor(
    private invoicesService: InvoicesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  setCustomer(id: string): void {
    this.customerId.setValue(id);
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

  private jobTotalsFromJob(jobs: JobUnwindedPartial[]): InvoicesTotals {
    const totalsMap = new Map<string, ProductTotals>();
    jobs
      .map(job => job.products)
      .filter(prod => !!prod)
      .forEach(products => {
        const { name: _id, price, count, units } = products;
        const total = totalsMap.get(_id) || {
          _id,
          units,
          count: 0,
          total: 0,
        };
        total.count += count;
        total.total += price * count;
        totalsMap.set(_id, total);
      });
    const totals = [...totalsMap.values()].sort((a, b) => a._id > b._id ? 1 : -1);
    return {
      totals,
      grandTotal: totals.reduce((acc, curr) => acc + curr.total, 0),
    };
  }


}

