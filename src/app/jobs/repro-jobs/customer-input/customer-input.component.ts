import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
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
import { CustomerPartial } from 'src/app/interfaces';

function emptyArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

@Component({
  selector: 'app-customer-input',
  templateUrl: './customer-input.component.html',
  styleUrls: ['./customer-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomerInputComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomerInputComponent,
    },
  ],
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatIconModule, MatOptionModule],
})
export class CustomerInputComponent implements ControlValueAccessor, Validator {
  private inputElement = viewChild.required<ElementRef<HTMLInputElement>>('customerInput');

  customers = input.required({ transform: emptyArray<CustomerPartial> });

  customerNames = computed(() => this.customers().map((c) => c.CustomerName));

  control = new FormControl('', [this.nameValidator()]);

  inputValue = toSignal(this.control.valueChanges, { initialValue: '' });

  customersFiltered = computed(() => this.filterCustomer(this.customers(), this.inputValue()));

  onTouched: () => void = () => {};
  onValidationChange: () => void = () => {};

  required = input(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      this.customers();
      this.control.updateValueAndValidity({ emitEvent: false });
      this.onValidationChange();
    });
    effect(() => {
      this.setValidators(this.required());
    });
  }

  writeValue(obj: any): void {
    this.control.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    return this.control.errors;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  focus() {
    this.inputElement().nativeElement.focus();
  }

  private filterCustomer(customers: CustomerPartial[], value: string | null): CustomerPartial[] {
    const filterValue = new RegExp(value || '', 'i');
    return customers.filter((customer) => filterValue.test(customer.CustomerName));
  }

  private nameValidator(): ValidatorFn {
    return (control) => {
      const value: string = control.value;
      const isValid = !value || this.customerNames().includes(value);
      return isValid ? null : { notFound: value };
    };
  }

  private setValidators(required: boolean) {
    const validators = [this.nameValidator()];
    if (required) {
      validators.push(Validators.required);
    }
    this.control.setValidators(validators);
    this.control.updateValueAndValidity({ emitEvent: false });
    this.onValidationChange();
  }
}
