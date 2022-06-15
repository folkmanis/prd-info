import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  ControlValueAccessor, UntypedFormArray, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators
} from '@angular/forms';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs/operators';
import { CustomerProduct } from 'src/app/interfaces';
import { JobProduct } from 'src/app/jobs';
import { ReproProductComponent } from './repro-product/repro-product.component';

@Component({
  selector: 'app-repro-products-editor',
  templateUrl: './repro-products-editor.component.html',
  styleUrls: ['./repro-products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReproProductsEditorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ReproProductsEditorComponent,
    }
  ]
})
export class ReproProductsEditorComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChildren(ReproProductComponent) productComponents: QueryList<ReproProductComponent>;

  @Input() customerProducts: CustomerProduct[] = [];

  @Input() showPrices: boolean;

  @Input() small = false;

  form = new UntypedFormGroup({
    products: new UntypedFormArray([]),
  });

  get productsControl() {
    return this.form.get('products') as UntypedFormArray;
  }

  onTouched: () => void = () => { };
  onValidationChange: () => void = () => { };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  writeValue(obj: JobProduct[] | null): void {
    if (!(obj instanceof Array)) {
      this.productsControl.clear({ emitEvent: false });
      this.check();
      return;
    }
    if (obj.length === this.productsControl.length) {
      this.productsControl.setValue(obj, { emitEvent: false });
      return;
    }
    this.productsControl.clear();
    obj.forEach(prod => this.productsControl.push(new UntypedFormControl(prod)), { emitEvent: false });
    this.check();
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.productsControl.valueChanges.pipe(
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

    if (this.productsControl.valid) return null;

    return this.productsControl.controls.map(({ errors }) => errors);

  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  ngOnInit(): void {
    this.form.statusChanges.subscribe(_ => this.check());
  }

  focusLatest() {
    this.productComponents.last.focus();
  }

  onRemoveProduct(idx: number) {
    this.productsControl.removeAt(idx);
  }

  onAddProduct() {
    this.productsControl.push(new UntypedFormControl(
      null,
      [Validators.required]
    ));
    setTimeout(() => this.focusLatest(), 0);
  }

  private check() {
    this.changeDetector.markForCheck();
  }

}
