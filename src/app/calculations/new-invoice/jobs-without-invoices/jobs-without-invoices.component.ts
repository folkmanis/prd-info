import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { JobsWithoutInvoicesTotals } from 'src/app/jobs';

@Component({
  selector: 'app-jobs-without-invoices',
  standalone: true,
  templateUrl: './jobs-without-invoices.component.html',
  styleUrls: ['./jobs-without-invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, CurrencyPipe],
})
export class JobsWithoutInvoicesComponent {
  @Input() noInvoices: JobsWithoutInvoicesTotals[] = [];

  @Output() customerChanges = new EventEmitter<string>();

  onSetCustomer(id: string) {
    this.customerChanges.next(id);
  }
}
