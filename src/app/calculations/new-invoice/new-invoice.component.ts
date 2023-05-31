import { ChangeDetectionStrategy, Component, OnInit, Signal, ViewChild, computed, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { JobUnwindedPartial } from 'src/app/jobs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { InvoicesTotals } from '../interfaces';
import { InvoicesService } from '../services/invoices.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerButtonDirective } from 'src/app/library/side-button/drawer-button.directive';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { SelectionTotalsComponent } from './selection-totals/selection-totals.component';
import { JobsWithoutInvoicesComponent } from './jobs-without-invoices/jobs-without-invoices.component';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { JobSelectionTableComponent } from '../job-selection-table/job-selection-table.component';
import { CustomerSelectorComponent } from './customer-selector/customer-selector.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-new-invoice',
  standalone: true,
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CustomerSelectorComponent,
    MatSidenavModule,
    DrawerButtonDirective,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    SelectionTotalsComponent,
    JobsWithoutInvoicesComponent,
    ViewSizeModule,
    ReactiveFormsModule,
    JobSelectionTableComponent,
    ScrollTopDirective,
    MatButtonModule,
  ]
})
export class NewInvoiceComponent {

  @ViewChild(ScrollTopDirective) private scroll: ScrollTopDirective;

  @ViewChild(CustomerSelectorComponent) private customerSelector?: CustomerSelectorComponent;

  noInvoices$ = this.invoicesService.jobsWithoutInvoicesTotals$;

  customerId: Signal<string>;

  jobs: Signal<JobUnwindedPartial[]>;

  selectedJobs = signal<JobUnwindedPartial[]>([]);

  selection = computed(() => this.selectedJobs().map(job => job.jobId));

  invoicesTotals = computed(() => this.jobTotalsFromJob(this.selectedJobs()));
  grandTotal = computed(() => this.invoicesTotals().grandTotal);

  constructor(
    private invoicesService: InvoicesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const customerId$ = this.route.queryParamMap.pipe(
      map(params => params.get('customer') || '')
    );
    this.customerId = toSignal(customerId$, { initialValue: '' });
    const jobs$ = customerId$.pipe(
      switchMap(customer => invoicesService.getJobsUnwinded({ customer, invoice: 0, limit: 1000 }))
    );
    this.jobs = toSignal(jobs$, { initialValue: [] });

    effect(() => this.jobs() && this.scroll?.scrollToTop());
    effect(() => this.selectedJobs.set(this.jobs()), { allowSignalWrites: true });
  }

  onCreateInvoice() {
    this.invoicesService.createInvoice({ jobIds: this.selection(), customerId: this.customerId() })
      .subscribe(({ invoiceId }) => this.router.navigate(['calculations', 'plate-invoice', invoiceId]));
  }

  onPrintList() {
    const { totals, grandTotal } = this.invoicesTotals();
    const invoice: InvoiceForReport = {
      customer: this.customerId(),
      createdDate: new Date(),
      jobs: this.selectedJobs(),
      products: totals.map(tot => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
      invoiceId: '',
    };
    this.invoicesService.getReport(invoice).subscribe(data => {
      window.open(URL.createObjectURL(data), 'new');
    });
  }

  onSelectCustomer(id: string) {
    this.customerSelector?.setCustomer(id);
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

