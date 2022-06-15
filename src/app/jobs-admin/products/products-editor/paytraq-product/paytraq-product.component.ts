import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, Input } from '@angular/core';
import { UntypedFormControl, NgControl, NgForm, Validators } from '@angular/forms';
import { IFormArray, IFormGroup, IControlValueAccessor, IFormControl } from '@rxweb/types';
import { Observable, Subject } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { PaytraqProductsService } from '../../services/paytraq-products.service';
import { PaytraqProduct } from 'src/app/interfaces/paytraq';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-paytraq-product',
  templateUrl: './paytraq-product.component.html',
  styleUrls: ['./paytraq-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaytraqProductComponent implements OnInit, OnDestroy, IControlValueAccessor<number> {
  @ViewChild(MatButton) private button: MatButton;
  @Input() set product(product: Product) {
    this.productSearch.setValue(
      product && !this.value ? product.name : null
    );
  }
  set value(value: number | null) { this._value = value; }
  get value(): number | null { return this._value; }
  private _value: number | null = null;

  readonly products$ = new Subject<PaytraqProduct[]>();

  private onChanges: (obj: number | null) => void;
  private onTouched: () => void;
  disabled = false;
  productSearch: IFormControl<string> = new UntypedFormControl(null);

  constructor(
    private paytraqService: PaytraqProductsService,
    private ngControl: NgControl,
  ) {
    this.ngControl.valueAccessor = this;
  }

  get pristine(): boolean {
    return this.ngControl.pristine;
  }

  writeValue(obj: number) {
    this.products$.next([]);
    this.value = obj;
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
  }

  onClearValue() {
    this.value = null;
    this.onChanges(this.value);
  }

}
