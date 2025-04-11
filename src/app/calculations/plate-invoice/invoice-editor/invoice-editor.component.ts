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
import { Invoice } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { DATE_FNS_LOCALE } from 'src/app/library/date-services';
import { navigateRelative } from 'src/app/library/navigation';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { configuration } from 'src/app/services/config.provider';
import { JobSelectionTableComponent } from '../../job-selection-table/job-selection-table.component';
import { InvoicesService } from '../../services/invoices.service';
import { InvoiceCsv } from './invoice-csv';
import { InvoicePaytraqComponent } from './invoice-paytraq/invoice-paytraq.component';
import { InvoiceProductsComponent } from './invoice-products/invoice-products.component';

const deleteSuccessMessage = (id: string) => `Aprēķins ${id} izdzēsts`;
const errorMessage = (err: Error) => `Radās kļūda: ${err.message}`;

const PAYTRAQ_SAVED_MESSAGE = 'Izveidota pavadzīme Paytraq sistēmā';
const PAYTRAQ_UNLINK_MESSAGE = 'Paytraq savienojums dzēsts';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    ViewSizeDirective,
    InvoicePaytraqComponent,
    InvoiceProductsComponent,
    JobSelectionTableComponent,
    MatButtonModule,
    RouterLink,
    MatCardModule,
    DatePipe,
  ],
})
export class InvoiceEditorComponent {
  private locale = inject<Locale>(DATE_FNS_LOCALE, { optional: true });
  private navigate = navigateRelative();
  private snack = inject(MatSnackBar);
  private invoicesService = inject(InvoicesService);
  private confirmation = inject(ConfirmationDialogService);

  invoice = input.required<Invoice>();

  pyatraqEnabled = configuration('paytraq', 'enabled');

  isJobsAdmin = toSignal(inject(LoginService).isModuleAvailable('jobs-admin'), { initialValue: false });

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
      this.snack.open(errorMessage(err), 'OK', { duration: 5000 });
    }
  }

  async onSaveToPaytraq() {
    this.busy.set(true);
    const invoice = this.invoice();

    try {
      const paytraqId = await this.invoicesService.postPaytraqInvoice(invoice);
      const documentRef = await this.invoicesService.getPaytraqInvoiceRef(paytraqId);
      await this.invoicesService.updateInvoice(invoice.invoiceId, {
        paytraq: { paytraqId, documentRef },
      });
      this.snack.open(PAYTRAQ_SAVED_MESSAGE, 'OK', { duration: 5000 });
      this.reload();
    } catch (error) {
      this.snack.open(errorMessage(error), 'OK', { duration: 5000 });
    } finally {
      this.busy.set(false);
    }
  }

  async onUnlinkPaytraq() {
    this.busy.set(true);
    const { invoiceId } = this.invoice();

    try {
      await this.invoicesService.updateInvoice(invoiceId, { paytraq: null });
      this.snack.open(PAYTRAQ_UNLINK_MESSAGE, 'OK', { duration: 5000 });
      this.reload();
    } catch (error) {
      this.snack.open(errorMessage(error), 'OK', { duration: 5000 });
    } finally {
      this.busy.set(false);
    }
  }

  private reload() {
    this.navigate(['..', this.invoice().invoiceId], {
      queryParams: { upd: Date.now() },
    });
  }
}
