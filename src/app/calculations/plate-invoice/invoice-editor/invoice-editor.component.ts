import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { saveAs } from 'file-saver';
import { InvoiceForReport } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { navigateRelative } from 'src/app/library/navigation';
import { updateCatching } from 'src/app/library/update-catching';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { configuration } from 'src/app/services/config.provider';
import { JobSelectionTableComponent } from '../../job-selection-table/job-selection-table.component';
import { InvoiceCsvService } from '../../services/invoice-csv.service';
import { InvoicesService } from '../../services/invoices.service';
import { InvoicePaytraqComponent } from './invoice-paytraq/invoice-paytraq.component';
import { InvoiceProductsComponent } from './invoice-products/invoice-products.component';

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
  #navigate = navigateRelative();
  #invoicesService = inject(InvoicesService);
  #csvInvoices = inject(InvoiceCsvService);
  #confirmation = inject(ConfirmationDialogService);

  invoice = input.required<InvoiceForReport>();

  protected pyatraqEnabled = configuration('paytraq', 'enabled');

  protected isJobsAdmin = inject(LoginService).isModule('jobs-admin');

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  onCsvInvoice(): void {
    saveAs(this.#csvInvoices.csvInvoice(this.invoice()));
  }

  onCsvReport(): void {
    saveAs(this.#csvInvoices.csvReport(this.invoice()));
  }

  async onDelete() {
    this.#update(async (message) => {
      const confirmation = await this.#confirmation.confirmDelete();
      if (!confirmation) {
        return;
      }

      const { invoiceId } = this.invoice();
      await this.#invoicesService.deleteInvoice(invoiceId);
      message(`Aprēķins ${invoiceId} izdzēsts`);
      this.#navigate(['..']);
    });
  }

  async onSaveToPaytraq() {
    this.#update(async (message) => {
      const documentRef = await this.#invoicesService.saveToPaytraq(this.invoice());
      message(`Izveidota pavadzīme ${documentRef} Paytraq sistēmā`);
      this.#reload();
    });
  }

  async onUnlinkPaytraq() {
    this.#update(async (message) => {
      const { invoiceId } = this.invoice();
      await this.#invoicesService.updateInvoice(invoiceId, { paytraq: null });
      message('Paytraq savienojums dzēsts');
      this.#reload();
    });
  }

  #reload() {
    this.#navigate(['..', this.invoice().invoiceId], {
      queryParams: { upd: Date.now() },
    });
  }
}
