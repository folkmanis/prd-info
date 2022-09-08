import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { DestroyService } from 'prd-cdk';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CustomerProduct } from 'src/app/interfaces';
import { JobProduct } from 'src/app/jobs';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';


const DEFAULT_PRODUCT: JobProduct = {
  name: '',
  price: 0,
  units: 'gab.',
  count: 0,
  comment: null,
};

@Component({
  selector: 'app-repro-product',
  templateUrl: './repro-product.component.html',
  styleUrls: ['./repro-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReproProductComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ReproProductComponent,
    },
  ],
})
export class ReproProductComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChild(ProductAutocompleteComponent)
  productNameControl: ProductAutocompleteComponent;

  customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

  form = ReproProductComponent.createForm(DEFAULT_PRODUCT);

  @Input('customerProducts')
  set customerProducts(value: CustomerProduct[]) {
    this.customerProducts$.next(value || []);
    this.form.controls.name.updateValueAndValidity();
    this.onValidationChange();
  }
  get customerProducts() {
    return this.customerProducts$.value;
  }

  private _showPrices = false;
  @Input() set showPrices(value: any) {
    this._showPrices = coerceBooleanProperty(value);
  }
  get showPrices() {
    return this._showPrices;
  }

  onTouched: () => void = () => { };
  onValidationChange: () => void = () => { };

  @Output() remove = new Subject<void>();


  constructor(
    private changedetector: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  writeValue(obj: JobProduct): void {
    this.form.patchValue(obj || DEFAULT_PRODUCT, { emitEvent: false });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(): ValidationErrors {
    if (this.form.valid) {
      return null;
    }

    let errors: Record<string, any> = {};
    errors = this.addControlErrors(errors, 'name');
    errors = this.addControlErrors(errors, 'price');
    errors = this.addControlErrors(errors, 'count');
    errors = this.addControlErrors(errors, 'units');

    return errors;

  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.check());
  }

  focus() {
    this.productNameControl.focus();
  }

  onAddPrice() {
    const price = this.customerProducts.find(prod => prod.productName === this.form.value.name)?.price;
    if (price) {
      this.form.patchValue({ price });
      this.form.get('price').markAsDirty();
    }
  }

  check() {
    this.changedetector.markForCheck();
  }

  static createForm(product: Partial<JobProduct> = {}) {
    return new FormGroup({
      name: new FormControl(product.name),
      price: new FormControl(
        product.price,
        {
          validators: [Validators.required, Validators.min(0)],
        },
      ),
      count: new FormControl(
        product.count,
        {
          validators: [Validators.required, Validators.min(0)],
        },
      ),
      units: new FormControl(
        product.units,
        Validators.required,
      ),
      comment: new FormControl(product.comment),
    });
  }


  private addControlErrors(allErrors: Record<string, any>, controlName: string): Record<string, any> {

    const errors = { ...allErrors };
    const control = this.form.get(controlName);

    if (control.errors) {
      errors[controlName] = control.errors;
    }

    return errors;
  }

}
