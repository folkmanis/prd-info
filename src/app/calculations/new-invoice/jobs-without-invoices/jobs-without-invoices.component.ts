import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, inject } from '@angular/core';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { MatListModule } from '@angular/material/list';
import { CurrencyPipe, NgFor } from '@angular/common';

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

  @Output() customerChanges = new EventEmitter<string>();

  onSetCustomer(id: string) {
    this.customerChanges.next(id);
  }


}
