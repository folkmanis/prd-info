import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  HostListener,
  Inject, Input, OnDestroy, OnInit,
  QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, NgControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { IControlValueAccessor, IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { from, Observable, Subject } from 'rxjs';
import { filter, pluck, switchMap, toArray } from 'rxjs/operators';
import { CustomerProduct, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';
import * as equal from 'fast-deep-equal';

export const DEFAULT_UNITS = 'gab.';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements OnInit, OnDestroy, IControlValueAccessor<JobProduct[]> {
  @ViewChildren(ProductAutocompleteComponent) private nameInputs: QueryList<ProductAutocompleteComponent>;
  @ViewChild(MatTable) private table: MatTable<IFormGroup<JobProduct>>;

  @Input() set customerProducts(customerProducts: CustomerProduct[]) {
    this._customerProducts = customerProducts || [];
    this.updateValueAndValidity();
  }
  get customerProducts(): CustomerProduct[] {
    return this._customerProducts;
  }
  private _customerProducts: CustomerProduct[] = [];

  columns: string[] = ['action', 'name', 'count', 'units' ]; // 'price', 'total', 'comments'

  readonly stateChanges = new Subject<void>();
  private previousValue: JobProduct[];

  prodFormArray: IFormArray<JobProduct> = new FormArray([]);
  private fb: IFormBuilder;
  private valid = false;

  readonly units$ = this.config$.pipe(
    pluck('jobs', 'productUnits'),
    switchMap(units => from(units).pipe(
      filter(unit => !unit.disabled),
      toArray(),
    ))
  );

  onChangeFn: (obj: JobProduct[]) => void;
  onTouchFn: () => void;

  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
      this.onAddNewProduct();
    }
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private ngControl: NgControl,
    fb: FormBuilder,
  ) {
    this.ngControl.valueAccessor = this;
    this.fb = fb;
  }

  writeValue(obj: JobProduct[]) {
    // TODO make smarter
    this.previousValue = obj;
    if (this.prodFormArray.length > 0) {
      this.prodFormArray.clear();
    }

    if (!obj) { return; }

    for (const product of obj) {
      this.prodFormArray.push(
        this.productFormGroup(product)
      );
    };
    this.stateChanges.next();
  }

  registerOnChange(fn: (obj: JobProduct[]) => void) {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.prodFormArray.disable() : this.prodFormArray.enable();
    this.stateChanges.next();
  }

  ngOnInit(): void {
    this.stateChanges.subscribe(_ => {
      this.table.renderRows();
      this.changeDetector.markForCheck();
    });
    this.prodFormArray.valueChanges
      .subscribe(val => {
        if (!equal(this.previousValue, val)) {
          this.previousValue = val;
          this.onChangeFn(val);
        }
      });
    this.prodFormArray.statusChanges
      .subscribe(status => {
        this.valid = (status === 'VALID');
        this.ngControl.control.updateValueAndValidity();
      });
    this.ngControl.control.setValidators(this.validate());
  }

  validate(): ValidatorFn {
    return () => this.valid ? null : { products: 'Invalid' };
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  onAddNewProduct() {
    if (!this.prodFormArray.valid) { return; }
    const prodForm = this.productFormGroup();
    this.prodFormArray.push(prodForm);
    setTimeout(() => {
      this.nameInputs.last.focus();
    }, 0);
    this.stateChanges.next();
  }

  onRemoveProduct(idx: number) {
    this.prodFormArray.removeAt(idx);
    this.prodFormArray.markAsDirty();
    this.stateChanges.next();
  }

  private updateValueAndValidity() {
    if (!this.prodFormArray) { return; }
    for (const cg of this.prodFormArray.controls) {
      cg.get('name').updateValueAndValidity({ emitEvent: false });
    }
    this.stateChanges.next();
  }

  private productFormGroup(product?: Partial<JobProduct>, enabled = true): IFormGroup<JobProduct> {
    const _group = this.fb.group<JobProduct>({
      name: [
        product?.name,
        {
          validators: [Validators.required, this.productValidatorFn()],
        }
      ],
      price: [
        product?.price,
        {
          validators: [Validators.min(0)],
        }
      ],
      count: [
        product?.count || 0,
        {
          validators: [Validators.min(0)],
        }
      ],
      units: [
        product?.units || DEFAULT_UNITS,
        {
          validators: [Validators.required],
        }
      ],
      comment: [product?.comment],
    }, {
      // validators: [this.defaultPriceValidatorFn()],
    }
    );
    enabled ? _group.enable() : _group.disable();
    return _group;
  }


  private defaultPriceValidatorFn(): ValidatorFn {
    let prevVal: JobProduct | undefined;
    return (control: IFormGroup<JobProduct>): null | ValidationErrors => {
      // if (!control.controls.name.valid) {
      //   return null;
      // }
      /* ja pirmoreiz */
      /* ja mainās produkta nosaukums */
      if ((prevVal === undefined || prevVal.name !== control.value.name) && !control.value.price) {
        const customerProduct = this.customerProducts.find(product => product.productName === control.value.name);
        /* un ja ir atrasta cena */
        if (customerProduct) {
          prevVal = { ...control.value, price: customerProduct.price || 0, units: customerProduct.units };
          control.setValue(prevVal);
        }
      }
      prevVal = control.value;
      return null;
    };
  }

  private productValidatorFn(): ValidatorFn {
    return (control: IFormControl<string>): null | ValidationErrors => this.customerProducts.some(
      product => product.productName === control.value
    ) ? null : { invalidProduct: 'Prece nav atrasta katalogā' };
  }

}
