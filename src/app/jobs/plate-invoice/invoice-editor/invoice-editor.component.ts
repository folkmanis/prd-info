import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, shareReplay, pluck } from 'rxjs/operators';
import { Invoice } from 'src/app/interfaces';
import { InvoicesService } from '../../services/invoices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoiceReport } from './invoice-report';
import { InvoiceCsv } from './invoice-csv';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss']
})
export class InvoiceEditorComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    private customersService: CustomersService,
    @Inject(LOCALE_ID) private locale: string,
  ) { }

  invoice$: Observable<Invoice> = this.route.paramMap.pipe(
    map(params => params.get('invoiceId') as string | undefined),
    filter(invoiceId => !!invoiceId),
    switchMap(invoiceId => this.invoicesService.getInvoice(invoiceId)),
    map(invoice => ({
      ...invoice,
      total: invoice.products.reduce((acc, curr) => acc + curr.total, 0)
    })),
  );

  ngOnInit(): void {
  }

  onPdfDownload(invoice: Invoice): void {
    const report = new InvoiceReport(invoice, this.locale);
    report.open();
  }

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

}
