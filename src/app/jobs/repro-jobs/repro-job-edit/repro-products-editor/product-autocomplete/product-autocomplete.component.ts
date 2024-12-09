import { ChangeDetectionStrategy, Component, ElementRef, Injector, Input, OnInit, Signal, ViewChild, computed, inject, input, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomerProduct } from 'src/app/interfaces';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatOptionModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductAutocompleteComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductAutocompleteComponent,
      multi: true,
    },
  ],
})
export class ProductAutocompleteComponent implements ControlValueAccessor, Validator {
  private inputElement = viewChild.required<ElementRef<HTMLInputElement>>('name');

  customerProducts = input<CustomerProduct[]>([]);

  control = new FormControl('', { validators: [Validators.required, this.productNameValidatorFn()] });

  value = toSignal(this.control.valueChanges, {
    initialValue: '',
  });

  filtered = computed(() => this.filterProducts(this.value(), this.customerProducts()));
  firstProducts = computed(() => this.filtered().filter((pr) => pr.price !== undefined));
  restProducts = computed(() => this.filtered().filter((pr) => pr.price == undefined));

  onTouchFn = () => {};

  writeValue(obj: any): void {
    this.control.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: true });
    } else {
      this.control.enable({ emitEvent: true });
    }
  }

  validate(): ValidationErrors {
    return this.control.errors;
  }

  focus(): void {
    this.inputElement().nativeElement.focus();
  }

  private filterProducts(controlValue: string, products: CustomerProduct[]): CustomerProduct[] {
    const name = controlValue?.toUpperCase();
    return products.filter((pr) => pr.productName.toUpperCase().includes(name));
  }

  private productNameValidatorFn(): ValidatorFn {
    const err = { invalidProduct: 'Prece nav atrasta katalogā' };
    return (control: AbstractControl<string>) => {
      return this.customerProducts().some((prod) => prod.productName === control.value) ? null : err;
    };
  }
}
