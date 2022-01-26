import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, QueryList, Self, ViewChild, ViewChildren } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { from, Observable, Subject } from 'rxjs';
import { filter, map, pluck, switchMap, toArray } from 'rxjs/operators';
import { CustomerProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { LoginService } from 'src/app/login';
import { ProductFormArray } from '../../services/product-form-array';
import { ProductFormGroup } from '../../services/product-form-group';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ReproProductComponent } from './repro-product/repro-product.component';
import { JobFormProvider } from '../repro-job-edit.component';
import { JobFormGroup } from '../../services/job-form-group';

export const DEFAULT_UNITS = 'gab.';

const COLUMNS = ['name', 'count'];
// const COLUMNS = ['action', 'name', 'count', 'units'];

@Component({
  selector: 'app-repro-products-editor',
  templateUrl: './repro-products-editor.component.html',
  styleUrls: ['./repro-products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproProductsEditorComponent implements OnInit {

  @ViewChildren(ReproProductComponent) productComponents: QueryList<ReproProductComponent>;

  @Input() disabled = false;

  @Input() customerProducts: CustomerProduct[] = [];

  columns$: Observable<string[]> = this.loginService.isModule('calculations').pipe(
    map(show => show ? [...COLUMNS, 'price', 'total'] : COLUMNS)
  );

  @Output('removeProduct') removeProduct$ = new EventEmitter<number>();

  readonly stateChanges = new Subject<void>();

  form: JobFormGroup;

  readonly units$ = this.config$.pipe(
    pluck('jobs', 'productUnits'),
    switchMap(units => from(units).pipe(
      filter(unit => !unit.disabled),
      toArray(),
    ))
  );

  get productsControl() {
    return this.form.products;
  }
  get controls() {
    return this.form.products.controls as ProductFormGroup[];
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private loginService: LoginService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private formProvider: JobFormProvider,
  ) { }

  ngOnInit(): void {

    this.form = this.formProvider.form;

    this.stateChanges.subscribe(_ => {
      // this.table.renderRows();
      this.changeDetector.markForCheck();
    });

    this.productsControl.valueChanges.subscribe(_ => this.stateChanges.next());

  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  focusLatest() {
    this.productComponents.last.focus();
  }

  onRemoveProduct(idx: number) {
    this.productsControl.removeProduct(idx);
  }

  onAddProduct() {
    this.productsControl.addProduct();
    setTimeout(() => this.focusLatest(), 0);
  }



}
