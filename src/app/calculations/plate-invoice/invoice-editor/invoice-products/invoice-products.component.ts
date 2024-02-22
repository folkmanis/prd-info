import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Invoice } from 'src/app/interfaces';
import { InvoiceEditor } from '../invoice-editor.component';

const COLUMNS = ['_id', 'count', 'price', 'total'];

@Component({
  selector: 'app-invoice-products',
  standalone: true,
  templateUrl: './invoice-products.component.html',
  styleUrls: ['./invoice-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    CurrencyPipe,
    MatButtonModule,
  ],
})
export class InvoiceProductsComponent {

  private invoiceEditor = inject(InvoiceEditor);

  invoice = input.required<Invoice>();

  pyatraqEnabled = input(false, { transform: booleanAttribute });

  products = computed(() => this.invoice().products);

  total = computed(() => this.invoice().total || 0);

  displayedColumns = computed(
    () => this.pyatraqEnabled() ? ['paytraqId', ...COLUMNS] : [...COLUMNS]
  );

  isJobsAdmin = input(false, { transform: booleanAttribute });

  onNavigateToProduct(name: string) {
    this.invoiceEditor.navigateToProduct(name);
  }


}
