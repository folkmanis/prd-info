import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpressionInputDirective } from 'prd-cdk';
import { CustomerProduct } from 'src/app/interfaces';
import { JobProduct } from 'src/app/jobs/interfaces';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';
import { ProductControlDirective } from './product-control.directive';

@Component({
  selector: 'app-repro-product',
  templateUrl: './repro-product.component.html',
  styleUrls: ['./repro-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    ProductAutocompleteComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CurrencyPipe,
    ProductControlDirective,
    ExpressionInputDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ReproProductComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ReproProductComponent,
      multi: true,
    },
  ],
  host: {
    '[class.disabled]': 'productForm.disabled',
  },
  hostDirectives: [
    {
      directive: ViewSizeDirective,
    },
  ],
})
export class ReproProductComponent implements ControlValueAccessor, Validator {
  private productNameControl = viewChild.required(ProductAutocompleteComponent);

  isSmall = inject(ViewSizeDirective, { host: true }).isSmall;

  customerProducts = input<CustomerProduct[]>([]);

  productForm = inject(FormBuilder).nonNullable.group({
    name: [null as string | null, Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    count: [null as number | null, [Validators.required, Validators.min(0)]],
    units: [null as string | null, Validators.required],
    comment: [null as string | null],
  });

  productFormValueChanges = toSignal(this.productForm.valueChanges, { initialValue: this.productForm.value });

  name = computed(() => this.productFormValueChanges().name);

  showPrices = input(false);

  remove = output<void>();

  onTouched: () => void = () => {};
  onValidatorChange = () => {};

  constructor() {
    effect(() => {
      this.customerProducts();
      this.productForm.updateValueAndValidity();
      this.onValidatorChange();
    });
  }

  writeValue(value: JobProduct): void {
    this.productForm.reset(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.productForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.productForm.disable({ emitEvent: false });
    } else {
      this.productForm.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors {
    const errors = Object.entries(this.productForm.controls)
      .filter(([, control]) => control.errors)
      .map(([name, control]) => [name, control.errors]);
    return Object.fromEntries(errors);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  focus() {
    this.productNameControl().focus();
  }

  onSetPrice() {
    const price = this.customerProducts().find((prod) => prod.productName === this.productForm.value.name)?.price;
    if (price) {
      this.productForm.controls.price.setValue(price);
    }
  }

  onProductSelected({ units, price }: CustomerProduct) {
    if (units && this.productForm.value.units !== units) {
      this.productForm.controls.units.setValue(units);
    }
    const priceControl = this.productForm.controls.price;
    if (price && (priceControl.value === null || priceControl.value === 0) && priceControl.value !== price) {
      priceControl.setValue(price);
    }
  }
}
