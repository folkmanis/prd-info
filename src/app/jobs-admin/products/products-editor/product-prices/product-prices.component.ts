import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { CustomerPartial, ProductPrice } from 'src/app/interfaces';

type PricesForm = ReturnType<typeof productPriceGroup>;

@Component({
  selector: 'app-product-prices',
  templateUrl: './product-prices.component.html',
  styleUrls: ['./product-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductPricesComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductPricesComponent,
      multi: true,
    }
  ],
})
export class ProductPricesComponent implements OnInit, ControlValueAccessor, Validator {

  @Input() customers: CustomerPartial[] = [];

  pricesFormArray = new FormArray<PricesForm>(
    [],
    [this.duplicateCustomersValidator]
  );

  touchFn = () => { };

  constructor(
    private chDetector: ChangeDetectorRef,
  ) { }

  writeValue(obj: ProductPrice[]): void {
    obj = obj instanceof Array ? obj : [];
    if (obj.length === this.pricesFormArray.length) {
      this.pricesFormArray.setValue(obj, { emitEvent: false });
    } else {
      this.pricesFormArray.clear({ emitEvent: false });
      for (const price of obj) {
        this.pricesFormArray.push(
          productPriceGroup(price),
          { emitEvent: false }
        );
      }
    }
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: (p: ProductPrice[]) => void): void {
    this.pricesFormArray.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.pricesFormArray.disable({ emitEvent: false });
    } else {
      this.pricesFormArray.enable({ emitEvent: false });
    }
  }

  validate(control: AbstractControl<any, any>): ValidationErrors {
    if (this.pricesFormArray.valid) {
      return null;
    }
    return {
      errors: this.pricesFormArray.controls.filter(ctrl => ctrl.invalid).map(ctr => ctr.errors)
    };
  }

  ngOnInit(): void {
  }

  removePrice(idx: number): void {
    this.pricesFormArray.removeAt(idx);
    this.chDetector.markForCheck();
  }

  addPrice(price?: ProductPrice) {
    this.pricesFormArray.push(
      productPriceGroup(price)
    );
    this.pricesFormArray.markAsDirty();
    this.chDetector.markForCheck();
  }

  private duplicateCustomersValidator(ctrl: AbstractControl<ProductPrice[]>): ValidationErrors | null {
    const customers: string[] = (ctrl.value).map(pr => pr.customerName);
    const duplicates: string[] = customers.filter((val, idx, self) => self.indexOf(val) !== idx);
    return duplicates.length === 0 ? null : { duplicates: duplicates.join() };
  }


}

function productPriceGroup(price: ProductPrice) {
  return new FormGroup({
    customerName: new FormControl(
      price?.customerName,
      [Validators.required],
    ),
    price: new FormControl(
      price?.price,
      [
        Validators.required,
        Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)
      ]
    ),
    lastUsed: new FormControl<Date>(
      {
        value: null,
        disabled: true
      },
    )
  });
}


