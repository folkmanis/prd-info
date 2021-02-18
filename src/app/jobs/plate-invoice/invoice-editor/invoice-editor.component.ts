import { Component, OnInit, OnDestroy, LOCALE_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, merge } from 'rxjs';
import { filter, map, switchMap, shareReplay, pluck, mergeMap, mapTo } from 'rxjs/operators';
import { Invoice, InvoiceProduct } from 'src/app/interfaces';
import { PaytraqInvoice, PaytraqNewInvoiceResponse } from 'src/app/interfaces/paytraq';
import { InvoicesService } from '../services/invoices.service';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { InvoiceReport } from './invoice-report';
import { InvoiceCsv } from './invoice-csv';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss']
})
export class InvoiceEditorComponent implements OnInit, OnDestroy {

  private _routeInvoice$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('invoiceId') as string | undefined),
    filter(invoiceId => !!invoiceId),
  );

  private _invoiceUpdate$ = new Subject<string>();

  invoice$: Observable<Invoice> = merge(
    this._routeInvoice$,
    this._invoiceUpdate$,
  ).pipe(
    switchMap(invoiceId => this.invoicesService.getInvoice(invoiceId)),
    map(invoice => ({
      ...invoice,
      total: invoice.products.reduce((acc, curr) => acc + curr.total, 0)
    })),
    shareReplay(1),
  );

  pyatraqEnabled$: Observable<boolean> = this.systemPreferencesService.preferences$.pipe(
    pluck('paytraq', 'enabled'),
  );

  paytraqOk$: Observable<boolean> = this.invoice$.pipe(
    map(invoice => !invoice.paytraq && invoice.products.length > 0 && allProductsWithPaytraq(invoice.products)),
  );

  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    @Inject(LOCALE_ID) private locale: string,
    private systemPreferencesService: SystemPreferencesService,
  ) { }


  ngOnInit(): void {
  };

  ngOnDestroy() {
    this._invoiceUpdate$.complete();
  }

  onPdfDownload(invoice: Invoice): void {
    const report = new InvoiceReport(invoice, this.locale);
    report.open();
  };

  onCsvInvoice(invoice: Invoice): void {
    const csv = new InvoiceCsv(invoice, { separator: ',', locale: this.locale });
    const file = new File([csv.toCsvInvoice()], `Invoice ${invoice.invoiceId}.csv`, { type: 'text/csv' });
    saveAs(file);
  };

  onCsvReport(invoice: Invoice): void {
    const csv = new InvoiceCsv(invoice, { separator: ',', locale: this.locale });
    saveAs(
      new File([csv.toCsvReport()], `${invoice.customer}-${invoice.invoiceId}.csv`, { type: 'text/csv' })
    );
  }

  onPaytraq(invoice: Invoice): void {
    this.invoicesService.postPaytraqInvoice(invoice).pipe(
      mergeMap(paytraqId => this.invoicesService.getPaytraqInvoiceRef(paytraqId).pipe(
        mergeMap(documentRef => this.invoicesService.updateInvoice(
          invoice.invoiceId,
          { paytraq: { paytraqId, documentRef } })
        ),
      ))
    ).subscribe(_ => this._invoiceUpdate$.next(invoice.invoiceId));
  }

  onUnlinkPaytraq(invoice: Invoice): void {
    const id = invoice.invoiceId;
    this.invoicesService.updateInvoice(
      id,
      { paytraq: null }
    ).subscribe(_ => this._invoiceUpdate$.next(id));
  }

}

function allProductsWithPaytraq(products: InvoiceProduct[]): boolean {
  for (const prod of products) {
    if (!prod.paytraqId) { return false; }
  }
  return true;
}
