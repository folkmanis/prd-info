import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PaytraqProduct } from 'src/app/interfaces/paytraq';
import { PaytraqSearchHeaderComponent } from 'src/app/jobs-admin/paytraq-search-header/paytraq-search-header.component';
import { PaytraqProductsService } from '../../services/paytraq-products.service';
import { PaytraqProductTableComponent } from './paytraq-product-table/paytraq-product-table.component';

@Component({
  selector: 'app-paytraq-product',
  standalone: true,
  templateUrl: './paytraq-product.component.html',
  styleUrls: ['./paytraq-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaytraqProductTableComponent, PaytraqSearchHeaderComponent, MatButtonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PaytraqProductComponent,
      multi: true,
    },
  ],
})
export class PaytraqProductComponent implements ControlValueAccessor {
  private paytraqService = inject(PaytraqProductsService);

  private onChanges: (obj: number | null) => void;
  private onTouched: () => void;

  productName = input<string>('');

  value = signal<number | null>(null);

  products = signal<PaytraqProduct[] | null>(null);

  disabled = signal(false);

  search = model('');

  constructor() {
    effect(() => {
      const value = this.value();
      this.onChanges(value);
    });
    effect(
      () => {
        this.search.set(this.productName());
      },
      { allowSignalWrites: true },
    );
  }

  writeValue(obj: number) {
    this.products.set(null);
    this.value.set(obj);
  }

  registerOnChange(fn: (obj: number) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  onSearchProducts() {
    this.disabled.set(true);
    this.onTouched();
    this.paytraqService.getProducts({ query: this.search().trim() }).subscribe((products) => {
      this.products.set(products);
      this.disabled.set(false);
    });
  }

  onProductSelected(product: PaytraqProduct) {
    this.value.set(product.itemID);
  }

  onClearValue() {
    this.value.set(null);
  }
}
