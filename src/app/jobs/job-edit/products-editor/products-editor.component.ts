import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  HostListener, Input, OnDestroy, OnInit,
  QueryList, ViewChildren
} from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { IFormArray, IFormGroup } from '@rxweb/types';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { filter, pluck, switchMap, takeUntil, toArray } from 'rxjs/operators';
import { CustomerProduct, JobProduct } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { SystemPreferencesService } from 'src/app/services';
import { JobEditFormService } from '../services/job-edit-form.service';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';

const COLUMNS = ['name', 'count', 'price', 'total', 'comment'];

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  @ViewChildren(ProductAutocompleteComponent) private nameInputs: QueryList<ProductAutocompleteComponent>;

  @Input() set customerProducts(customerProducts: CustomerProduct[]) {
    this._customerProducts = customerProducts || [];
    if (this.prodFormArray) {
      this.setArrayValidators(this.prodFormArray, customerProducts);
    }
    this.ch.markForCheck();
    console.log(customerProducts);
  }
  get customerProducts(): CustomerProduct[] {
    return this._customerProducts;
  }

  private _customerProducts: CustomerProduct[] = [];

  prodFormArray: IFormArray<JobProduct>;

  units$ = this.sysPref.preferences$.pipe(
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
    private ch: ChangeDetectorRef,
    private destroy$: DestroyService,
    private jobFormService: JobEditFormService,
    private controlContainer: ControlContainer,
    private sysPref: SystemPreferencesService,
  ) { }

  get isEnabled(): boolean {
    return !this.prodFormArray.disabled;
  }
  get isValid(): boolean {
    return !this.prodFormArray.disabled && this.prodFormArray.valid;
  }

  ngOnInit(): void {
    this.prodFormArray = this.controlContainer.control as IFormArray<JobProduct>;

  }

  ngOnDestroy(): void {
  }

  onAddNewProduct() {
    if (!this.isValid) { return; }
    const prodForm = this.jobFormService.productFormGroup();
    this.jobFormService.setProductGroupValidators(prodForm, this.customerProducts);
    this.prodFormArray.push(prodForm);
    this.ch.markForCheck();
    setTimeout(() => {
      this.nameInputs.last.focus();
    }, 0);
  }

  removeProduct(idx: number) {
    this.prodFormArray.removeAt(idx);
    this.prodFormArray.markAsDirty();
    this.ch.markForCheck();
  }

  private setArrayValidators(frm: IFormArray<JobProduct>, customerProducts: CustomerProduct[]) {
    frm.controls.forEach((contr: IFormGroup<JobProduct>) => this.jobFormService.setProductGroupValidators(contr, customerProducts));
  }


}
