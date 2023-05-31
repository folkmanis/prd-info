import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
import { InvoiceCsv } from './invoice-csv';
import { InvoiceDeleteDirective } from './invoice-delete.directive';
import { InvoicePaytraqComponent } from './invoice-paytraq/invoice-paytraq.component';
import { InvoiceProductsComponent } from './invoice-products/invoice-products.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-invoice-editor',
  standalone: true,
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    InvoiceDeleteDirective,
    ViewSizeModule,
    InvoicePaytraqComponent,
    InvoiceProductsComponent,
    JobSelectionTableComponent,
    MatButtonModule,
    RouterLink,
    MatCardModule,
  ]
})
export class InvoiceEditorComponent {

  invoice$: Observable<Invoice> = this.route.data.pipe(
    map(data => data.invoice),
  );

  pyatraqEnabled$: Observable<boolean> = getConfig('paytraq', 'enabled');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Optional() @Inject(DATE_FNS_LOCALE) private locale?: Locale,
  ) { }

  onCsvInvoice(invoice: Invoice): void {
    const csv = new InvoiceCsv(invoice, { separator: ',', locale: this.locale });
    const file = new File([csv.toCsvInvoice()], `Invoice ${invoice.invoiceId}.csv`, { type: 'text/csv' });
    saveAs(file);
  }

  onCsvReport(invoice: Invoice): void {
    const csv = new InvoiceCsv(invoice, { separator: ',', locale: this.locale });
    saveAs(
      new File([csv.toCsvReport()], `${invoice.customer}-${invoice.invoiceId}.csv`, { type: 'text/csv' })
    );
  }

  onReload(invoiceId: string) {
    this.router.navigate(['..', invoiceId], { queryParams: { upd: Date.now() } });
  }

}

