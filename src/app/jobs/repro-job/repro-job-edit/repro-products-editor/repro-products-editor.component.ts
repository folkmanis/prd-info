import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, NgControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import * as equal from 'fast-deep-equal';
import { from, Observable, Subject } from 'rxjs';
import { filter, pluck, switchMap, toArray } from 'rxjs/operators';
import { CustomerProduct, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';

export const DEFAULT_UNITS = 'gab.';

const COLUMNS = ['action', 'name', 'count', 'units'];

@Component({
  selector: 'app-repro-products-editor',
  templateUrl: './repro-products-editor.component.html',
  styleUrls: ['./repro-products-editor.component.scss']
})
export class ReproProductsEditorComponent implements OnInit {

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

  @Input() showPrices: any = false;

  columns: string[] = [...COLUMNS]; // 'price', 'total', 'comments'

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
    if (coerceBooleanProperty(this.showPrices)) {
      this.columns = [...COLUMNS, 'price', 'total'];
    }

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

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  validate(): ValidatorFn {
    return () => this.valid ? null : { products: 'Invalid' };
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

  onAddPrice(group: IFormGroup<JobProduct>) {
    const price = this.customerProducts.find(prod => prod.productName === group.value.name)?.price;
    if (price) {
      group.patchValue({ price });
    }
  }

  private updateValueAndValidity() {
    if (!this.prodFormArray) { return; }
    for (const cg of this.prodFormArray.controls) {
      cg.get('name').updateValueAndValidity({ emitEvent: false });
    }
    this.stateChanges.next();
  }

  private productFormGroup(product?: Partial<JobProduct>): IFormGroup<JobProduct> {
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
    return _group;
  }

  private productValidatorFn(): ValidatorFn {
    return (control: IFormControl<string>): null | ValidationErrors => this.customerProducts.some(
      product => product.productName === control.value
    ) ? null : { invalidProduct: 'Prece nav atrasta katalogā' };
  }

}
