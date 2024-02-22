import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Invoice, InvoiceProduct } from 'src/app/interfaces';
import { configuration } from 'src/app/services/config.provider';
import { InvoiceEditor } from '../invoice-editor.component';


@Component({
  selector: 'app-invoice-paytraq',
  standalone: true,
  templateUrl: './invoice-paytraq.component.html',
  styleUrls: ['./invoice-paytraq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
})
export class InvoicePaytraqComponent {
  invoice = input.required<Invoice>();
  busy = input(false);

  paytraqUrl = configuration(
    'paytraq',
    'connectionParams',
    'invoiceUrl'
  );

  canCreatePaytraq = computed(() => {
    const { customerInfo, paytraq, products } = this.invoice();
    return (
      !!customerInfo?.financial?.paytraqId &&
      !paytraq &&
      allProductsWithPaytraq(products)
    );
  });

  private invoiceEditor = inject(InvoiceEditor);

  onPaytraq(): void {
    this.invoiceEditor.onSaveToPaytraq();
  }

  onUnlinkPaytraq(): void {
    this.invoiceEditor.onUnlinkPaytraq();
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
