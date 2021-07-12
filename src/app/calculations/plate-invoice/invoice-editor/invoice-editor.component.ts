import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, pluck, share, shareReplay, switchMap } from 'rxjs/operators';
import { Invoice, InvoiceProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { InvoicesService } from '../../services/invoices.service';
import { InvoiceCsv } from './invoice-csv';
import { InvoiceReport } from '../../services/invoice-report';
import { InvoiceResolverService } from '../../services/invoice-resolver.service';

const PAYTRAQ_SAVED_MESSAGE = 'Izveidota pavadzīme Paytraq sistēmā';
const PAYTRAQ_UNLINK_MESSAGE = 'Paytraq savienojums dzēsts';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceEditorComponent implements OnInit, OnDestroy {

  private _routeInvoice$: Observable<Invoice> = this.route.data.pipe(
    map(data => data.invoice),
  );

  private reload$ = new Subject<string>();

  invoice$: Observable<Invoice> = merge(
    this._routeInvoice$,
    this.reload$.pipe(switchMap(_ => this.invoiceResolver.reload())),
  ).pipe(
    map(invoice => ({
      ...invoice,
      total: invoice.products.reduce((acc, curr) => acc + curr.total, 0)
    })),
    share(),
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
    map(invoice => !invoice.paytraq && invoice.products.length > 0 && allProductsWithPaytraq(invoice.products))
  );

  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private snack: MatSnackBar,
    private invoiceResolver: InvoiceResolverService,
  ) { }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.reload$.complete();
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
      this.reload$.next(invoice.invoiceId);
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
      this.reload$.next(id);
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
