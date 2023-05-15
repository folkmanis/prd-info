import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaytraqProduct } from 'src/app/interfaces/paytraq';
import { PaytraqSearchHeaderComponent } from 'src/app/jobs-admin/paytraq-search-header/paytraq-search-header.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { PaytraqProductsService } from '../../services/paytraq-products.service';
import { PaytraqProductTableComponent } from './paytraq-product-table/paytraq-product-table.component';

@Component({
  selector: 'app-paytraq-product',
  standalone: true,
  templateUrl: './paytraq-product.component.html',
  styleUrls: ['./paytraq-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialLibraryModule,
    PaytraqProductTableComponent,
    PaytraqSearchHeaderComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PaytraqProductComponent,
      multi: true,
    }
  ]
})
export class PaytraqProductComponent implements ControlValueAccessor {

  @Input() set productName(name: string) {
    this.initialSearch.set(name || '');
  }

  private _value: number | null = null;
  set value(value: number | null) {
    this._value = value;
  }
  get value(): number | null {
    return this._value;
  }

  products = signal<PaytraqProduct[] | null>(null);

  initialSearch = signal('');
  searchDisabled = signal(false);

  private onChanges: (obj: number | null) => void;
  private onTouched: () => void;

  constructor(
    private paytraqService: PaytraqProductsService,
  ) { }

  writeValue(obj: number) {
    this.products.set(null);
    this.value = obj;
  }

  registerOnChange(fn: (obj: number) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.searchDisabled.set(isDisabled);
  }

  onSearchProducts(ev: string) {
    this.searchDisabled.set(true);
    this.onTouched();
    this.paytraqService.getProducts({ query: ev.trim() })
      .subscribe(products => {
        this.products.set(products);
        this.searchDisabled.set(false);
      });
  }

  onProductSelected(ev: PaytraqProduct) {
    this.value = ev.itemID;
    this.onChanges(this.value);
  }

  onClearValue() {
    this.value = null;
    this.onChanges(this.value);
  }

}
