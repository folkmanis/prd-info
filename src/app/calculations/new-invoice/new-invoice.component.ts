import { AsyncPipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Injector, input, signal, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { JobUnwindedPartial } from 'src/app/jobs';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { navigateRelative } from 'src/app/library/navigation';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { DrawerButtonDirective } from 'src/app/library/side-button/drawer-button.directive';
import { InvoicesTotals } from '../interfaces';
import { JobSelectionTableComponent } from '../job-selection-table/job-selection-table.component';
import { InvoicesService } from '../services/invoices.service';
import { CustomerSelectorComponent } from './customer-selector/customer-selector.component';
import { JobsWithoutInvoicesComponent } from './jobs-without-invoices/jobs-without-invoices.component';
import { SelectionTotalsComponent } from './selection-totals/selection-totals.component';

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
    SelectionTotalsComponent,
    JobsWithoutInvoicesComponent,
    ViewSizeDirective,
    JobSelectionTableComponent,
    ScrollTopDirective,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class NewInvoiceComponent {
  private invoicesService = inject(InvoicesService);
  private navigate = navigateRelative();
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private injector = inject(Injector);

  private scroll = viewChild(ScrollTopDirective);

  noInvoices$ = this.invoicesService.getJobsWithoutInvoicesTotals();

  customer = input('');

  jobs$ = toObservable(this.customer).pipe(
    switchMap((customer) => this.invoicesService.getJobsUnwinded({ customer, invoice: 0, limit: 1000 })),
    tap((jobs) => this.selectedJobs.set(jobs)),
    tap(() => this.scroll()?.scrollToTop()),
  );

  selectedJobs = signal<JobUnwindedPartial[]>([]);

  selection = computed(() => this.selectedJobs().map((job) => job.jobId));

  invoicesTotals = computed(() => this.jobTotalsFromJobs(this.selectedJobs()));
  grandTotal = computed(() => this.invoicesTotals().grandTotal);

  async onCreateInvoice() {
    try {
      const { invoiceId } = await this.invoicesService.createInvoice({ jobIds: this.selection(), customerId: this.customer() });
      this.router.navigate(['calculations', 'plate-invoice', invoiceId]);
    } catch (error) {
      this.snack.open(`Error ${error.message}`, 'OK');
    }
  }

  async onPrintList() {
    const { totals, grandTotal } = this.invoicesTotals();
    const invoice: InvoiceForReport = {
      customer: this.customer() ?? '',
      createdDate: new Date(),
      jobs: this.selectedJobs(),
      products: totals.map((tot) => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
      total: grandTotal,
      invoiceId: '',
    };
    const data = await this.invoicesService.getReport(invoice);
    afterNextRender(() => window.open(URL.createObjectURL(data), 'new'), { injector: this.injector });
  }

  onSelectCustomer(customer: string) {
    this.navigate(['.'], { queryParams: { customer } });
  }

  private jobTotalsFromJobs(jobs: JobUnwindedPartial[]): InvoicesTotals {
    const totalsMap = new Map<string, ProductTotals>();
    jobs
      .map((job) => job.products)
      .filter((prod) => !!prod)
      .forEach((products) => {
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
    const totals = [...totalsMap.values()].sort((a, b) => (a._id > b._id ? 1 : -1));
    return {
      totals,
      grandTotal: totals.reduce((acc, curr) => acc + curr.total, 0),
    };
  }
}
