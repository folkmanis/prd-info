import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  HostListener, Input, OnDestroy, OnInit,
  QueryList, ViewChildren, ViewChild, Inject
} from '@angular/core';
import { ControlContainer, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { from, Observable, Subject } from 'rxjs';
import { filter, pluck, switchMap, toArray } from 'rxjs/operators';
import { CustomerProduct, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { JobEditFormService } from '../services/job-edit-form.service';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';
import { MatTable } from '@angular/material/table';
import { CONFIG } from 'src/app/services/config.provider';


@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  @ViewChildren(ProductAutocompleteComponent) private nameInputs: QueryList<ProductAutocompleteComponent>;
  @ViewChild(MatTable) private table: MatTable<IFormGroup<JobProduct>>;

  @Input() set customerProducts(customerProducts: CustomerProduct[]) {
    this._customerProducts = customerProducts || [];
    this.updateValueAndValidity();
  }
  get customerProducts(): CustomerProduct[] {
    return this._customerProducts;
  }

  columns: string[] = ['action', 'name', 'count', 'units', 'price', 'total', 'comments'];

  private _customerProducts: CustomerProduct[] = [];

  readonly stateChanges = new Subject<void>();

  prodFormArray: IFormArray<JobProduct>;

  readonly units$ = this.config$.pipe(
    pluck('jobs', 'productUnits'),
    switchMap(units => from(units).pipe(
      filter(unit => !unit.disabled),
      toArray(),
    ))
  );


  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
      this.onAddNewProduct();
    }
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private jobFormService: JobEditFormService,
    private controlContainer: ControlContainer,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  ngOnInit(): void {
    this.prodFormArray = this.controlContainer.control as IFormArray<JobProduct>;
    this.setAllValidators(this.prodFormArray);
    this.stateChanges.subscribe(_ => {
      this.table.renderRows();
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  onAddNewProduct() {
    if (!this.prodFormArray.valid) { return; }
    const prodForm = this.jobFormService.productFormGroup();
    this.setProductGroupValidators(prodForm);
    this.prodFormArray.push(prodForm);
    setTimeout(() => {
      this.nameInputs.last.focus();
    }, 0);
    this.stateChanges.next();
  }

  removeProduct(idx: number) {
    this.prodFormArray.removeAt(idx);
    this.prodFormArray.markAsDirty();
    this.stateChanges.next();
  }

  private setAllValidators(frm: IFormArray<JobProduct>) {
    frm.controls.forEach((contr: IFormGroup<JobProduct>) => this.setProductGroupValidators(contr));
  }

  private updateValueAndValidity() {
    if (!this.prodFormArray) { return; }
    for (const cg of this.prodFormArray.controls) {
      cg.get('name').updateValueAndValidity();
      cg.updateValueAndValidity();
    }
    this.stateChanges.next();
  }

  private setProductGroupValidators(gr: IFormGroup<JobProduct>) {
    gr.controls.name.setValidators([Validators.required, this.productValidatorFn()]);
    gr.setValidators([this.defaultPriceValidatorFn()]);
  }

  private defaultPriceValidatorFn(): ValidatorFn {
    let prevVal: JobProduct | undefined;
    return (control: IFormGroup<JobProduct>): null | ValidationErrors => {
      if (!control.controls.name.valid) {
        return null;
      }
      /* ja pirmoreiz, vai mainās produkta nosaukums */
      if (prevVal === undefined || prevVal.name !== control.value.name) {
        const customerProduct = this.customerProducts.find(product => product.productName === control.value.name);
        /* un ja ir atrasta cena */
        if (customerProduct) {
          prevVal = { ...control.value, price: customerProduct.price || 0, units: customerProduct.units };
          control.setValue(prevVal);
        }
      }
      return null;
    };
  }

  private productValidatorFn(): ValidatorFn {
    return (control: IFormControl<string>): null | ValidationErrors => this.customerProducts.some(
        product => product.productName === control.value
      ) ? null : { invalidProduct: 'Prece nav atrasta katalogā' };
  }

}
