import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, ChangeDetectionStrategy, Self } from '@angular/core';
import { FormArray, FormBuilder, NgControl, ValidationErrors, ValidatorFn, Validators, ControlContainer } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import * as equal from 'fast-deep-equal';
import { from, Observable, Subject } from 'rxjs';
import { filter, map, pluck, switchMap, toArray } from 'rxjs/operators';
import { CustomerProduct, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { LoginService } from 'src/app/services/login.service';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';

export const DEFAULT_UNITS = 'gab.';

const COLUMNS = ['action', 'name', 'count', 'units'];

@Component({
  selector: 'app-repro-products-editor',
  templateUrl: './repro-products-editor.component.html',
  styleUrls: ['./repro-products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproProductsEditorComponent implements OnInit {

  @ViewChildren(ProductAutocompleteComponent) private nameInputs: QueryList<ProductAutocompleteComponent>;
  @ViewChild(MatTable) private table: MatTable<IFormGroup<JobProduct>>;

  @Input() set customerProducts(customerProducts: CustomerProduct[]) {
    this._customerProducts = customerProducts || [];
  }
  get customerProducts(): CustomerProduct[] {
    return this._customerProducts;
  }
  private _customerProducts: CustomerProduct[] = [];

  columns$: Observable<string[]> = this.loginService.isModule('calculations').pipe(
    map(show => show ? [...COLUMNS, 'price', 'total'] : COLUMNS)
  );

  @Output('removeProduct') removeProduct$ = new EventEmitter<number>();

  readonly stateChanges = new Subject<void>();

  prodFormArray: IFormArray<JobProduct>;

  readonly units$ = this.config$.pipe(
    pluck('jobs', 'productUnits'),
    switchMap(units => from(units).pipe(
      filter(unit => !unit.disabled),
      toArray(),
    ))
  );

  constructor(
    private changeDetector: ChangeDetectorRef,
    private loginService: LoginService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    @Self() private controlContainer: ControlContainer,
  ) { }

  ngOnInit(): void {
    this.prodFormArray = this.controlContainer.control as FormArray;

    this.stateChanges.subscribe(_ => {
      this.table.renderRows();
      this.changeDetector.markForCheck();
    });

    this.prodFormArray.valueChanges.subscribe(_ => this.stateChanges.next());

  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  onAddPrice(idx: number) {
    const group = this.prodFormArray.at(idx);
    const price = this.customerProducts.find(prod => prod.productName === group.value.name)?.price;
    if (price) {
      group.patchValue({ price });
      group.get('price').markAsDirty();
    }
  }

  focusLatest() {
    this.nameInputs.last.focus();
  }

}
