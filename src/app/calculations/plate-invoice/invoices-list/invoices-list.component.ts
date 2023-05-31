import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { InvoicesService } from '../../services/invoices.service';

const COLUMNS = ['invoiceId', 'customer', 'createdDate', 'totalSum'];

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    DatePipe,
    CurrencyPipe,
    RouterLink,
  ]
})
export class InvoicesListComponent {

  datasource = inject(InvoicesService).getInvoicesHttp({});
  displayedColumns: string[] = COLUMNS;

}
