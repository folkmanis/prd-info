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
import { InvoiceResolverService } from '../../services/invoice-resolver.service';


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
    share(),
  );

  pyatraqEnabled$: Observable<boolean> = this.config$.pipe(
    pluck('paytraq', 'enabled'),
  );

  constructor(
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private invoiceResolver: InvoiceResolverService,
  ) { }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.reload$.complete();
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

  onReload() {
    this.reload$.next(null);
  }

}

