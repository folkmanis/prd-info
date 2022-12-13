import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatLegacyButton as MatButton } from '@angular/material/legacy-button';
import { Subject } from 'rxjs';
import { PaytraqProduct } from 'src/app/interfaces/paytraq';
import { PaytraqProductsService } from '../../services/paytraq-products.service';

@Component({
  selector: 'app-paytraq-product',
  templateUrl: './paytraq-product.component.html',
  styleUrls: ['./paytraq-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PaytraqProductComponent,
      multi: true,
    }
  ]
})
export class PaytraqProductComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild(MatButton) private button: MatButton;

  @Input() set productName(name: string) {
    this.productSearch.setValue(name || '');
  }

  private _value: number | null = null;
  set value(value: number | null) {
    this._value = value;
  }
  get value(): number | null {
    return this._value;
  }

  productSearch = new FormControl<string>('');

  disabled = false;
  pristine = true;

  readonly products$ = new Subject<PaytraqProduct[]>();

  private onChanges: (obj: number | null) => void;
  private onTouched: () => void;

  constructor(
    private paytraqService: PaytraqProductsService,
  ) { }

  writeValue(obj: number) {
    this.products$.next([]);
    this.value = obj;
    this.pristine = true;
  }

  registerOnChange(fn: (obj: number) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.products$.complete();
  }

  onSearchProducts(ev: string) {
    this.button.disabled = true;
    this.onTouched();
    this.paytraqService.getProducts({ query: ev })
      .subscribe(products => {
        this.products$.next(products);
        this.button.disabled = false;
      });
  }

  onProductSelected(ev: PaytraqProduct) {
    this.value = ev.itemID;
    this.onChanges(this.value);
    this.pristine = false;
  }

  onClearValue() {
    this.value = null;
    this.onChanges(this.value);
    this.pristine = true;
  }

}
