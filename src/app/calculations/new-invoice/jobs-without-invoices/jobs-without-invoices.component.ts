import { ChangeDetectionStrategy, Component, Input, Optional, inject } from '@angular/core';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { MatListModule } from '@angular/material/list';
import { CurrencyPipe, NgFor } from '@angular/common';
import { InvoiceCustomerSelector } from '../customer-selector/invoice-customer-selector.class';

@Component({
  selector: 'app-jobs-without-invoices',
  standalone: true,
  templateUrl: './jobs-without-invoices.component.html',
  styleUrls: ['./jobs-without-invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListModule,
    NgFor,
    CurrencyPipe,
  ]
})
export class JobsWithoutInvoicesComponent {

  @Input() noInvoices: JobsWithoutInvoicesTotals[] = [];

  private selector = inject(InvoiceCustomerSelector, { optional: true });

  onSetCustomer(id: string) {
    this.selector?.setCustomer(id);
  }


}
