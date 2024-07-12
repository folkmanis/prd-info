import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, inject, input, output, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerProduct } from 'src/app/interfaces';
import { JobProduct } from 'src/app/jobs/interfaces';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';
import { JobProductForm } from './job-product-form.interface';
import { ProductControlDirective } from './product-control.directive';

@Component({
  selector: 'app-repro-product',
  templateUrl: './repro-product.component.html',
  styleUrls: ['./repro-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ViewSizeModule,
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
})
export class ReproProductComponent implements ControlValueAccessor, Validator {
  private productNameControl = viewChild.required(ProductAutocompleteComponent);

  customerProducts = input<CustomerProduct[]>([]);

  productForm: JobProductForm = inject(FormBuilder).nonNullable.group({
    name: [null as string | null, [this.productNameValidatorFn(this.customerProducts)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    count: [null as number | null, [Validators.required, Validators.min(0)]],
    units: [null as string | null, Validators.required],
    comment: [''],
  });

  productFormValueChanges = toSignal(this.productForm.valueChanges);

  name = computed(() => this.productFormValueChanges().name);

  showPrices = input(false);

  remove = output<void>();

  onTouched: () => void = () => {};

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
      this.productForm.disable();
    } else {
      this.productForm.enable();
    }
  }

  validate(): ValidationErrors {
    const errors = Object.entries(this.productForm.controls)
      .filter(([, control]) => control.errors)
      .map(([name, control]) => [name, control.errors]);
    return Object.fromEntries(errors);
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
    if (price && this.productForm.value.price !== price) {
      this.productForm.controls.price.setValue(price);
    }
  }

  private productNameValidatorFn(products: Signal<CustomerProduct[]>): ValidatorFn {
    const err = { invalidProduct: 'Prece nav atrasta katalogā' };
    return (control: AbstractControl<string>) => {
      return products().some((prod) => prod.productName === control.value) ? null : err;
    };
  }
}
