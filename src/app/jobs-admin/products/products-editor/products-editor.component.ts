import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Product } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { ProductsFormSource } from '../services/products-form-source';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormSource, useExisting: ProductsFormSource },
  ]
})
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  paytraqDisabled$ = this.systemPreferences.preferences$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );


  get form(): IFormGroup<Product> { return this.formSource.form; }
  get productionStages() {
    return this.formSource.productionStages;
  }

  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;
  readonly units$ = this.systemPreferences.preferences$.pipe(
    pluck('jobs', 'productUnits'),
    map(units => units.filter(u => !u.disabled)),
  );

  get isNew(): boolean { return this.formSource.isNew; }

  get pricesFormArray() { return this.form.get('prices') as AbstractControl as FormArray; }

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private systemPreferences: SystemPreferencesService,
    public formSource: ProductsFormSource,
  ) { }

  onDataChange(obj: Product) {
    this.paytraqPanel?.close();
    this.formSource.initValue(obj);
  }

  ngOnInit(): void {
  }

  onAddPrice(): void {
    this.formSource.addPrice();
  }

  onDeletePrice(idx: number): void {
    this.formSource.removePrice(idx);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }

}
