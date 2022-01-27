import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerPartial } from 'src/app/interfaces';

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
    }
  ]
})
export class CustomerInputComponent implements AfterViewInit, ControlValueAccessor, Validator {

  @ViewChild('customerInput') private input: ElementRef<HTMLInputElement>;


  private customers$ = new BehaviorSubject<CustomerPartial[]>([]);
  @Input() set customers(value: CustomerPartial[]) {
    this.customers$.next(value || []);
    this.onValidationChange();
  }
  get customers() {
    return this.customers$.value;
  }

  control = new FormControl(
    '',
    {
      validators: [
        Validators.required,
        this.validatorFn()
      ],
    }
  );

  customersFiltered$: Observable<CustomerPartial[]> = combineLatest([
    this.customers$,
    this.control.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(this.filterCustomer),
  );

  onTouched: () => void = () => { };
  onValidationChange: () => void = () => { };

  writeValue(obj: any): void {
    this.control.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  validate(): ValidationErrors {
    return this.control.errors;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.onfocus = this.onTouched;
  }

  focus() {
    this.input.nativeElement.focus();
  }

  private filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
    const filterValue = new RegExp(value || '', 'i');
    return customers.filter(customer => !customer.disabled && filterValue.test(customer.CustomerName));
  }

  private validatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      const isValid = this.customers.some(customer => customer.CustomerName === value);
      return isValid ? null : { noCustomer: `Klients ${value} nav atrasts` };
    };
  };


}
