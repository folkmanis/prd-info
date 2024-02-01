import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Locale } from 'date-fns';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice } from 'src/app/interfaces';
import { DATE_FNS_LOCALE } from 'src/app/library/date-services';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { getConfig } from 'src/app/services/config.provider';
import { JobSelectionTableComponent } from '../../job-selection-table/job-selection-table.component';
import { InvoicesService } from '../../services/invoices.service';
import { InvoiceCsv } from './invoice-csv';
import { InvoicePaytraqComponent } from './invoice-paytraq/invoice-paytraq.component';
import { InvoiceProductsComponent } from './invoice-products/invoice-products.component';

const deleteSuccessMessage = (id: string) => `Aprēķins ${id} izdzēsts`;
const deleteFailMessage = (err: Error) => `Radās kļūda: ${err.message}`;

@Component({
  selector: 'app-invoice-editor',
  standalone: true,
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    ViewSizeModule,
    InvoicePaytraqComponent,
    InvoiceProductsComponent,
    JobSelectionTableComponent,
    MatButtonModule,
    RouterLink,
    MatCardModule,
    DatePipe,
    AsyncPipe,
  ],
})
export class InvoiceEditorComponent {
  invoice$: Observable<Invoice> = this.route.data.pipe(
    map((data) => data.invoice)
  );

  pyatraqEnabled$: Observable<boolean> = getConfig('paytraq', 'enabled');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private invoicesService: InvoicesService,
    @Optional() @Inject(DATE_FNS_LOCALE) private locale?: Locale
  ) {}

  onCsvInvoice(invoice: Invoice): void {
    const csv = new InvoiceCsv(invoice, {
      separator: ',',
      locale: this.locale,
    });
    const file = new File(
      [csv.toCsvInvoice()],
      `Invoice ${invoice.invoiceId}.csv`,
      { type: 'text/csv' }
    );
    saveAs(file);
  }

  onCsvReport(invoice: Invoice): void {
    const csv = new InvoiceCsv(invoice, {
      separator: ',',
      locale: this.locale,
    });
    saveAs(
      new File(
        [csv.toCsvReport()],
        `${invoice.customer}-${invoice.invoiceId}.csv`,
        { type: 'text/csv' }
      )
    );
  }

  onDelete(id: string): void {
    this.invoicesService.deleteInvoice(id).subscribe({
      next: () => {
        this.snack.open(deleteSuccessMessage(id), 'OK', { duration: 5000 });
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) =>
        this.snack.open(deleteFailMessage(err), 'OK', { duration: 5000 }),
      complete: () => {},
    });
  }

  onReload(invoiceId: string) {
    this.router.navigate(['..', invoiceId], {
      relativeTo: this.route,
      queryParams: { upd: Date.now() },
    });
  }
}
