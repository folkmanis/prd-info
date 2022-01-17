import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { mergeMap, pluck } from 'rxjs/operators';
import { Invoice, InvoiceProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { InvoicesService } from '../../../services/invoices.service';

const PAYTRAQ_SAVED_MESSAGE = 'Izveidota pavadzīme Paytraq sistēmā';
const PAYTRAQ_UNLINK_MESSAGE = 'Paytraq savienojums dzēsts';

@Component({
  selector: 'app-invoice-paytraq',
  templateUrl: './invoice-paytraq.component.html',
  styleUrls: ['./invoice-paytraq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePaytraqComponent implements OnInit, OnDestroy {

  private _invoice: Invoice;
  @Input() set invoice(value: Invoice) {
    this._invoice = value;
    this.paytraqOk = value && !value.paytraq && allProductsWithPaytraq(value.products);
  }
  get invoice(): Invoice {
    return this._invoice;
  }

  @Output() paytraqUpdate = new Subject<string>();

  paytraqUrl$: Observable<string> = this.config$.pipe(
    pluck('paytraq', 'connectionParams', 'invoiceUrl')
  );

  readonly paytraqBusy$ = new Subject<boolean>();

  paytraqOk: boolean = false;

  constructor(
    private invoicesService: InvoicesService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.paytraqBusy$.complete();
  }

  onPaytraq(): void {
    this.paytraqBusy$.next(true);

    this.invoicesService.postPaytraqInvoice(this.invoice).pipe(
      mergeMap(paytraqId => this.invoicesService.getPaytraqInvoiceRef(paytraqId).pipe(
        mergeMap(documentRef => this.invoicesService.updateInvoice(
          this.invoice.invoiceId,
          { paytraq: { paytraqId, documentRef } })
        ),
      ))
    ).subscribe(_ => {
      this.paytraqUpdate.next(this.invoice.invoiceId);
      this.paytraqBusy$.next(false);
      this.snack.open(PAYTRAQ_SAVED_MESSAGE, 'OK', { duration: 5000 });
    });
  }

  onUnlinkPaytraq(): void {
    const id = this.invoice.invoiceId;
    this.invoicesService.updateInvoice(
      id,
      { paytraq: null }
    ).subscribe(_ => {
      this.paytraqUpdate.next(id);
      this.snack.open(PAYTRAQ_UNLINK_MESSAGE, 'OK', { duration: 5000 });
    });
  }

}

function allProductsWithPaytraq(products?: InvoiceProduct[]): boolean {
  if (!products || products.length === 0) {
    return false;
  }
  for (const prod of products) {
    if (!prod.paytraqId) { return false; }
  }
  return true;
}
