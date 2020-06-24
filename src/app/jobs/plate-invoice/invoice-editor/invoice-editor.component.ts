import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, shareReplay } from 'rxjs/operators';
import { Invoice } from 'src/app/interfaces';
import { InvoicesService } from '../../services/invoices.service';
import { InvoiceReport } from './invoice-report';
import { Store, Select, Actions } from '@ngxs/store';
import { InvoicesState } from '../../store/invoices.state';
import * as InvoicesActions from '../../store/invoices.actions';

@Component({
  selector: 'app-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.css']
})
export class InvoiceEditorComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) { }

  @Select(InvoicesState.selectedInvoice) selectedInvoice$: Observable<Invoice>;
  invoice$ = this.selectedInvoice$.pipe(
    filter(inv => !!inv),
    map(invoice => ({
      ...invoice,
      total: invoice.products.reduce((acc, curr) => acc + curr.total, 0)
    })),
  );

  private readonly _subs = new Subscription();

  ngOnInit(): void {
    this._subs.add(
      this.route.paramMap.pipe(
        map(params => params.get('invoiceId') as string | undefined),
        filter(invoiceId => !!invoiceId),
        switchMap(invoiceId => this.store.dispatch(new InvoicesActions.SelectInvoice(invoiceId))),
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onPdfDownload(invoice: Invoice): void {
    const report = new InvoiceReport(invoice);
    report.open();
  }

}
