import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, QueryList, Self, ViewChild, ViewChildren } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { from, Observable, Subject } from 'rxjs';
import { filter, map, pluck, switchMap, toArray } from 'rxjs/operators';
import { CustomerProduct, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { LoginService } from 'src/app/services/login.service';
import { ProductFormArray } from '../../services/product-form-array';
import { ProductFormGroup } from '../../services/product-form-group';
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
  @ViewChild(MatTable) private table: MatTable<ProductFormGroup>;

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

  prodFormArray: ProductFormArray;

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
    this.prodFormArray = this.controlContainer.control as ProductFormArray;

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
