import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, mergeMap } from 'rxjs';
import { Invoice, InvoiceProduct } from 'src/app/interfaces';
import { getConfig } from 'src/app/services/config.provider';
import { InvoicesService } from '../../../services/invoices.service';

const PAYTRAQ_SAVED_MESSAGE = 'Izveidota pavadzīme Paytraq sistēmā';
const PAYTRAQ_UNLINK_MESSAGE = 'Paytraq savienojums dzēsts';

@Component({
  selector: 'app-invoice-paytraq',
  standalone: true,
  templateUrl: './invoice-paytraq.component.html',
  styleUrls: ['./invoice-paytraq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatButtonModule],
})
export class InvoicePaytraqComponent {
  @Input() invoice: Invoice;

  @Output() paytraqUpdate = new Subject<string>();

  paytraqUrl$: Observable<string> = getConfig(
    'paytraq',
    'connectionParams',
    'invoiceUrl'
  );

  paytraqBusy = signal(false);

  get paytraqOk(): boolean {
    return (
      !!this.invoice?.customerInfo?.financial?.paytraqId &&
      !this.invoice.paytraq &&
      allProductsWithPaytraq(this.invoice.products)
    );
  }

  constructor(
    private invoicesService: InvoicesService,
    private snack: MatSnackBar
  ) {}

  onPaytraq(): void {
    this.paytraqBusy.set(true);

    this.invoicesService
      .postPaytraqInvoice(this.invoice)
      .pipe(
        mergeMap((paytraqId) =>
          this.invoicesService.getPaytraqInvoiceRef(paytraqId).pipe(
            mergeMap((documentRef) =>
              this.invoicesService.updateInvoice(this.invoice.invoiceId, {
                paytraq: { paytraqId, documentRef },
              })
            )
          )
        )
      )
      .subscribe(() => {
        this.paytraqUpdate.next(this.invoice.invoiceId);
        this.paytraqBusy.set(false);
        this.snack.open(PAYTRAQ_SAVED_MESSAGE, 'OK', { duration: 5000 });
      });
  }

  onUnlinkPaytraq(): void {
    const id = this.invoice.invoiceId;
    this.invoicesService.updateInvoice(id, { paytraq: null }).subscribe((_) => {
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
    if (!prod.paytraqId) {
      return false;
    }
  }
  return true;
}
