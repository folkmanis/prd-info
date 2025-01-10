import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Invoice, InvoiceProduct } from 'src/app/interfaces';
import { configuration } from 'src/app/services/config.provider';

@Component({
  selector: 'app-invoice-paytraq',
  templateUrl: './invoice-paytraq.component.html',
  styleUrls: ['./invoice-paytraq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule],
})
export class InvoicePaytraqComponent {
  invoice = input.required<Invoice>();
  busy = input(false);

  paytraqUrl = configuration('paytraq', 'connectionParams', 'invoiceUrl');

  saveToPaytraq = output<void>();
  unlinkPaytraq = output<void>();

  canCreatePaytraq = computed(() => {
    const { customerInfo, paytraq, products } = this.invoice();
    return !!customerInfo?.financial?.paytraqId && !paytraq && allProductsWithPaytraq(products);
  });

  onPaytraq(): void {
    this.saveToPaytraq.emit();
  }

  onUnlinkPaytraq(): void {
    this.unlinkPaytraq.emit();
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
