import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import {
  FormControl, FormGroup,
  ControlValueAccessor,
  Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS, FormArray, AbstractControl, ValidationErrors
} from '@angular/forms';
import { from, Observable, Subject } from 'rxjs';
import { filter, pluck, switchMap, takeUntil, toArray } from 'rxjs/operators';
import { CustomerProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { JobFormGroup } from '../../services/job-form-group';
import { JobFormProvider } from '../repro-job-edit.component';
import { ReproProductComponent } from './repro-product/repro-product.component';
import { DestroyService } from 'prd-cdk';
import { JobProduct } from 'src/app/jobs';

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
export class ReproProductsEditorComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @ViewChildren(ReproProductComponent) productComponents: QueryList<ReproProductComponent>;

  @Input() customerProducts: CustomerProduct[] = [];

  @Input() showPrices: boolean;

  form = new FormGroup({
    products: new FormArray([]),
  });

  get productsControl() {
    return this.form.get('products') as FormArray;
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
    obj.forEach(prod => this.productsControl.push(new FormControl(prod)), { emitEvent: false });
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

  ngOnInit(): void {

    // this.form.valueChanges.subscribe(_ => this.stateChanges.next());
    this.form.statusChanges.subscribe(_ => this.check());

  }

  ngOnDestroy(): void {
  }

  focusLatest() {
    this.productComponents.last.focus();
  }

  onRemoveProduct(idx: number) {
    this.productsControl.removeAt(idx);
  }

  onAddProduct() {
    this.productsControl.push(new FormControl());
    setTimeout(() => this.focusLatest(), 0);
  }

  private check() {
    this.changeDetector.markForCheck();
  }

}
