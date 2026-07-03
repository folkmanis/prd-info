import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { pick } from 'lodash-es';
import { InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { JobUnwindedPartial } from 'src/app/jobs';
import { navigateRelative } from 'src/app/library/navigation';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { DrawerButtonDirective } from 'src/app/library/side-button/drawer-button.directive';
import { updateCatching } from 'src/app/library/update-catching';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { InvoicesTotals } from '../interfaces';
import { JobSelectionTableComponent } from '../job-selection-table/job-selection-table.component';
import { InvoicesService } from '../services/invoices.service';
import { CustomerSelectorComponent } from './customer-selector/customer-selector.component';
import { JobsWithoutInvoicesComponent } from './jobs-without-invoices/jobs-without-invoices.component';
import { SelectionTotalsComponent } from './selection-totals/selection-totals.component';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
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
    MatCheckbox,
    MatTooltip,
  ],
})
export class NewInvoiceComponent {
  #invoicesService = inject(InvoicesService);
  #navigate = navigateRelative();
  #router = inject(Router);

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  protected detailedJobs = signal(false);

  noInvoices$ = this.#invoicesService.getJobsWithoutInvoicesTotals();

  customer = input('');

  #jobsFilter = computed(() => ({
    customer: this.customer(),
    invoice: 0 as 0,
    limit: 1000,
  }));

  protected jobs = this.#invoicesService.jobsUnwindedResource(this.#jobsFilter);

  protected selectedJobs = linkedSignal(() => this.jobs.value() ?? []);

  #selectedIds = computed(() => this.selectedJobs().map((job) => job.jobId));

  protected invoicesTotals = computed(() => this.jobTotalsFromJobs(this.selectedJobs()));
  protected grandTotal = computed(() => this.invoicesTotals().grandTotal);

  async onCreateInvoice() {
    this.#update(async (message) => {
      const { invoiceId } = await this.#invoicesService.createInvoice({
        jobIds: this.#selectedIds(),
        customerId: this.customer(),
        detailedJobs: this.detailedJobs(),
      });
      message(`Izveidots aprēķins ${invoiceId}`);
      this.#router.navigate(['calculations', 'plate-invoice', invoiceId]);
    });
  }

  async onPrintList() {
    this.#update(async () => {
      const { totals, grandTotal } = this.invoicesTotals();
      const invoice: InvoiceForReport = {
        customer: this.customer() ?? '',
        createdDate: new Date(),
        jobs: this.selectedJobs().map((p) => pick(p, ['products', 'receivedDate', 'name', 'jobId'])),
        products: totals.map((tot) => ({ ...tot, price: tot.total / tot.count, jobsCount: 0 })),
        total: grandTotal,
        invoiceId: '',
      };
      const data = await this.#invoicesService.getReport(invoice);
      window.open(URL.createObjectURL(data), 'new');
    });
  }

  onSelectCustomer(customer: string) {
    const queryParams = customer ? { customer } : undefined;
    this.#navigate(['.'], { queryParams });
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
