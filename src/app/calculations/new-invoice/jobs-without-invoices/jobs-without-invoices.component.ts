import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';

@Component({
  selector: 'app-jobs-without-invoices',
  templateUrl: './jobs-without-invoices.component.html',
  styleUrls: ['./jobs-without-invoices.component.scss'],
  imports: [MatListModule, CurrencyPipe],
})
export class JobsWithoutInvoicesComponent {
  noInvoices = input([] as JobsWithoutInvoicesTotals[]);

  customerChange = output<string>();

  onSetCustomer(id: string) {
    this.customerChange.emit(id);
  }
}
