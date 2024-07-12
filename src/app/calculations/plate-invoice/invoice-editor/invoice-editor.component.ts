import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Locale } from 'date-fns';
import { saveAs } from 'file-saver';
import { map, mergeMap } from 'rxjs';
import { Invoice } from 'src/app/interfaces';
import { navigateRelative } from 'src/app/library/common';
import { DATE_FNS_LOCALE } from 'src/app/library/date-services';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { LoginService } from 'src/app/login';
import { ProductsService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { JobSelectionTableComponent } from '../../job-selection-table/job-selection-table.component';
import { InvoicesService } from '../../services/invoices.service';
import { InvoiceCsv } from './invoice-csv';
import { InvoicePaytraqComponent } from './invoice-paytraq/invoice-paytraq.component';
import { InvoiceProductsComponent } from './invoice-products/invoice-products.component';
import { ConfirmationDialogService } from 'src/app/library';

const deleteSuccessMessage = (id: string) => `Aprēķins ${id} izdzēsts`;
const deleteFailMessage = (err: Error) => `Radās kļūda: ${err.message}`;

const PAYTRAQ_SAVED_MESSAGE = 'Izveidota pavadzīme Paytraq sistēmā';
const PAYTRAQ_UNLINK_MESSAGE = 'Paytraq savienojums dzēsts';

export abstract class InvoiceEditor {
  abstract onSaveToPaytraq(): void;
  abstract onUnlinkPaytraq(): void;
  abstract navigateToProduct(name: string): void;
}

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
  ],
  providers: [{ provide: InvoiceEditor, useExisting: InvoiceEditorComponent }],
})
export class InvoiceEditorComponent implements InvoiceEditor {
  private locale?: Locale = inject<Locale>(DATE_FNS_LOCALE, { optional: true });
  private navigate = navigateRelative();
  private snack = inject(MatSnackBar);
  private invoicesService = inject(InvoicesService);
  private productsService = inject(ProductsService);
  private confirmation = inject(ConfirmationDialogService);

  invoice = input.required<Invoice>();

  pyatraqEnabled = configuration('paytraq', 'enabled');

  isJobsAdmin = toSignal(inject(LoginService).user$.pipe(map((usr) => usr.preferences.modules.includes('jobs-admin'))), { initialValue: false });

  busy = signal(false);

  onCsvInvoice(): void {
    const invoice = this.invoice();
    const csv = new InvoiceCsv(invoice, {
      separator: ',',
      locale: this.locale,
    });
    const file = new File([csv.toCsvInvoice()], `Invoice ${invoice.invoiceId}.csv`, { type: 'text/csv' });
    saveAs(file);
  }

  onCsvReport(): void {
    const invoice = this.invoice();

    const csv = new InvoiceCsv(invoice, {
      separator: ',',
      locale: this.locale,
    });
    saveAs(new File([csv.toCsvReport()], `${invoice.customer}-${invoice.invoiceId}.csv`, { type: 'text/csv' }));
  }

  async onDelete() {
    const confirmation = await this.confirmation.confirmDelete();
    if (!confirmation) {
      return;
    }

    const { invoiceId } = this.invoice();

    try {
      await this.invoicesService.deleteInvoice(invoiceId);
      this.snack.open(deleteSuccessMessage(invoiceId), 'OK', { duration: 5000 });
      this.navigate(['..']);
    } catch (err) {
      this.snack.open(deleteFailMessage(err), 'OK', { duration: 5000 });
    }
  }

  onSaveToPaytraq(): void {
    this.busy.set(true);
    const invoice = this.invoice();

    this.invoicesService
      .postPaytraqInvoice(invoice)
      .pipe(
        mergeMap((paytraqId) =>
          this.invoicesService.getPaytraqInvoiceRef(paytraqId).pipe(
            mergeMap((documentRef) =>
              this.invoicesService.updateInvoice(invoice.invoiceId, {
                paytraq: { paytraqId, documentRef },
              }),
            ),
          ),
        ),
      )
      .subscribe(() => {
        this.busy.set(false);
        this.snack.open(PAYTRAQ_SAVED_MESSAGE, 'OK', { duration: 5000 });
        this.reload();
      });
  }

  onUnlinkPaytraq(): void {
    this.busy.set(true);
    const { invoiceId } = this.invoice();
    this.invoicesService.updateInvoice(invoiceId, { paytraq: null }).subscribe(() => {
      this.busy.set(false);
      this.snack.open(PAYTRAQ_UNLINK_MESSAGE, 'OK', { duration: 5000 });
      this.reload();
    });
  }

  async navigateToProduct(name: string) {
    const product = await this.productsService.getProductByName(name);
    this.navigate(['/', 'jobs-admin', 'products', product._id]);
  }

  private reload() {
    this.navigate(['..', this.invoice().invoiceId], {
      queryParams: { upd: Date.now() },
    });
  }
}
