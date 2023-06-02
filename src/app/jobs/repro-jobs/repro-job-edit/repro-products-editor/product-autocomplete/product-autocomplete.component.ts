import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { CustomerProduct } from 'src/app/interfaces';
import { MatOptionModule } from '@angular/material/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-product-autocomplete',
    templateUrl: './product-autocomplete.component.html',
    styleUrls: ['./product-autocomplete.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ProductAutocompleteComponent,
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: ProductAutocompleteComponent,
        },
    ],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule, MatIconModule, NgIf, MatOptionModule, NgFor, AsyncPipe]
})
export class ProductAutocompleteComponent implements AfterViewInit, ControlValueAccessor, Validator {

  @ViewChild('name') private inputElement: ElementRef;

  private customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);
  @Input()
  set customerProducts(val: CustomerProduct[]) {
    this.customerProducts$.next(val || []);
    this.control.updateValueAndValidity();
    this.onValidationChange();
  }
  get customerProducts() {
    return this.customerProducts$.value;
  }

  control = new FormControl(
    '',
    {
      validators: [
        Validators.required,
        this.productNameValidatorFn()
      ]
    }
  );

  private filteredProducts$: Observable<CustomerProduct[]> = combineLatest([
    this.control.valueChanges.pipe(startWith('')),
    this.customerProducts$,
  ]).pipe(
    map(this.filterProducts),
    shareReplay(1),
  );
  firstProducts$: Observable<CustomerProduct[]> = this.filteredProducts$.pipe(
    map(prod => prod.filter(pr => pr.price !== undefined))
  );
  restProducts$: Observable<CustomerProduct[]> = this.filteredProducts$.pipe(
    map(prod => prod.filter(pr => pr.price === undefined))
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
    (this.inputElement.nativeElement as HTMLInputElement).onfocus = this.onTouched;
  }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

  private filterProducts([controlValue, products]: [string, CustomerProduct[]]): CustomerProduct[] {
    const name = controlValue.toUpperCase();
    return products.filter(pr => pr.productName.toUpperCase().includes(name));
  }

  private productNameValidatorFn(): ValidatorFn {
    return (control: AbstractControl) => {
      const err = { invalidProduct: 'Prece nav atrasta katalogā' };
      return this.customerProducts.some(prod => prod.productName === control.value) ? null : err;
    };
  };

}
