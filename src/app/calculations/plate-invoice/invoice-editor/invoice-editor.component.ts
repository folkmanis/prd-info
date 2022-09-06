import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Locale } from 'date-fns';
import { saveAs } from 'file-saver';
import { merge, Observable, Subject } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { Invoice } from 'src/app/interfaces';
import { DATE_FNS_LOCALE } from 'src/app/library/date-services';
import { getConfig } from 'src/app/services/config.provider';
import { InvoiceResolverService } from '../../services/invoice-resolver.service';
import { InvoiceCsv } from './invoice-csv';


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

  pyatraqEnabled$: Observable<boolean> = getConfig('paytraq', 'enabled');

  constructor(
    private route: ActivatedRoute,
    private invoiceResolver: InvoiceResolverService,
    @Optional() @Inject(DATE_FNS_LOCALE) private locale?: Locale,
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

