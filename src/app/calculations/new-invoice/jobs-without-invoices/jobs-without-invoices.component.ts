import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { InvoiceCustomerSelector } from '../new-invoice.component';

@Component({
  selector: 'app-jobs-without-invoices',
  templateUrl: './jobs-without-invoices.component.html',
  styleUrls: ['./jobs-without-invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsWithoutInvoicesComponent {

  @Input() noInvoices: JobsWithoutInvoicesTotals[] = [];

  constructor(
    @Optional() private selector?: InvoiceCustomerSelector,
  ) { }

  onSetCustomer(id: string) {
    this.selector?.setCustomer(id);
  }


}
