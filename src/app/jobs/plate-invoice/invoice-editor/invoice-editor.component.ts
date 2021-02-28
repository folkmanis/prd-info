import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { Invoice, InvoiceProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { InvoicesService } from '../services/invoices.service';
import { InvoiceCsv } from './invoice-csv';
import { InvoiceReport } from './invoice-report';
import { log } from 'src/app/library/rx';

const PAYTRAQ_SAVED_MESSAGE = 'Izveidota pavadzīme Paytraq sistēmā';
const PAYTRAQ_UNLINK_MESSAGE = 'Paytraq savienojums dzēsts';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  pyatraqEnabled$: Observable<boolean> = this.config$.pipe(
    pluck('paytraq', 'enabled'),
  );

  paytraqUrl$: Observable<string> = combineLatest([
    this.config$.pipe(
      pluck('paytraq', 'connectionParams', 'invoiceUrl')
    ),
    this.invoice$
  ]).pipe(
    map(([base, invoice]) => base + invoice.paytraq?.paytraqId)
  );

  readonly paytraqBusy$ = new Subject<boolean>();

  paytraqOk$: Observable<boolean> = this.invoice$.pipe(
    map(
      ({ paytraq, customerInfo, products }) =>
        !paytraq && !!customerInfo.financial?.paytraqId && products.length > 0 && allProductsWithPaytraq(products)
    ),
  );

  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private snack: MatSnackBar,
  ) { }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._invoiceUpdate$.complete();
    this.paytraqBusy$.complete();
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

  onPaytraq(invoice: Invoice): void {
    this.paytraqBusy$.next(true);
    this.invoicesService.postPaytraqInvoice(invoice).pipe(
      mergeMap(paytraqId => this.invoicesService.getPaytraqInvoiceRef(paytraqId).pipe(
        mergeMap(documentRef => this.invoicesService.updateInvoice(
          invoice.invoiceId,
          { paytraq: { paytraqId, documentRef } })
        ),
      ))
    ).subscribe(_ => {
      this._invoiceUpdate$.next(invoice.invoiceId);
      this.paytraqBusy$.next(false);
      this.snack.open(PAYTRAQ_SAVED_MESSAGE, 'OK', { duration: 5000 });
    });
  }

  onUnlinkPaytraq(invoice: Invoice): void {
    const id = invoice.invoiceId;
    this.invoicesService.updateInvoice(
      id,
      { paytraq: null }
    ).subscribe(_ => {
      this._invoiceUpdate$.next(id);
      this.snack.open(PAYTRAQ_UNLINK_MESSAGE, 'OK', { duration: 5000 });
    });
  }

}

function allProductsWithPaytraq(products: InvoiceProduct[]): boolean {
  for (const prod of products) {
    if (!prod.paytraqId) { return false; }
  }
  return true;
}
