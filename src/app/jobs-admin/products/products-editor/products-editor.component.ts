import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormArray, IFormGroup } from '@rxweb/types';
import { IAbstractControl } from '@rxweb/types/reactive-form/i-abstract-control';
import { Observable } from 'rxjs';
import { Product, ProductPrice } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersService, ProductsService } from 'src/app/services';
import { ProductsFormSource } from '../services/products-form-source';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { map, pluck } from 'rxjs/operators';
import { SimpleFormControl } from 'src/app/library/simple-form';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormControl, useExisting: ProductsEditorComponent }
  ]
})
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate, SimpleFormControl<Product> {
  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private systemPreferences: SystemPreferencesService,
    private fb: FormBuilder,
  ) { }

  paytraqDisabled$ = this.systemPreferences.preferences$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );


  formSource = new ProductsFormSource(this.fb, this.productService);
  get form(): IFormGroup<Product> { return this.formSource.form; }

  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;
  readonly units$ = this.systemPreferences.preferences$.pipe(
    pluck('jobs', 'productUnits'),
    map(units => units.filter(u => !u.disabled)),
  );

  get isNew(): boolean { return this.formSource.isNew; }

  writeValue(obj: Product) {
    this.paytraqPanel?.close();
    this.formSource.initValue(obj);
  }

  ngOnInit(): void {
  }

  onAddPrice(frm: IAbstractControl<ProductPrice[], Product>): void {
    this.formSource.addPrice(frm as IFormArray<ProductPrice>);
  }

  onDeletePrice(frm: IAbstractControl<ProductPrice[], Product>, idx: number): void {
    this.formSource.removePrice(frm as IFormArray<ProductPrice>, idx);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }

}
