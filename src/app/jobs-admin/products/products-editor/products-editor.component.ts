import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, UntypedFormArray, ValidationErrors, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { of, Observable, map, pluck, Subject } from 'rxjs';
import { JobProductionStage, Product, ProductPrice } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersService, ProductsService } from 'src/app/services';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { SimpleFormTypedControl } from 'src/app/library/simple-form-typed';
import { isEqual, pickBy } from 'lodash';
import { ClassTransformer } from 'class-transformer';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormTypedControl, useExisting: ProductsEditorComponent },
  ]
})
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate, SimpleFormTypedControl<Product> {

  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  initialValue: Product | null = null;


  form = this.createForm();


  paytraqDisabled$ = this.systemPreferences.preferences$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );
  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;
  readonly units$ = this.systemPreferences.preferences$.pipe(
    pluck('jobs', 'productUnits'),
    map(units => units.filter(u => !u.disabled)),
  );

  stateChanges = this.form.statusChanges;

  get value() {
    return this.transformer.plainToInstance(
      Product,
      this.form.getRawValue(),
      { exposeDefaultValues: true }
    );
  }

  get changes(): Partial<Product> | undefined {
    if (this.initialValue) {
      const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
      return Object.keys(diff).length ? diff : undefined;
    } else {
      return this.value;
    }
  }

  get isNew(): boolean {
    return !this.initialValue?.name;
  }

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private systemPreferences: SystemPreferencesService,
    private transformer: ClassTransformer,
  ) { }

  onData(value: Product): void {
    if (value instanceof Product) {
      this.initialValue = this.transformer.instanceToInstance(value);
    } else {
      this.initialValue = new Product();
    }
    this.paytraqPanel?.close();
    this.onReset();
  }

  onReset(): void {
    this.form.reset(this.initialValue);
  }

  onCreate(): Observable<string | number> {
    return this.productService.insertProduct(this.value);
  }

  onUpdate(): Observable<Product> {
    const update = { ...this.changes, _id: this.value._id };
    return this.productService.updateProduct(update);

  }

  ngOnInit(): void {
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }


  private createForm() {
    return new FormGroup({
      _id: new FormControl<string>(''),
      inactive: new FormControl(false),
      category: new FormControl<string>(
        undefined,
        [Validators.required]
      ),
      name: new FormControl<string>(
        undefined,
        {
          validators: [Validators.required],
          asyncValidators: [this.nameAsyncValidator()]
        }
      ),
      description: new FormControl<string>(''),
      units: new FormControl<string>(
        undefined,
        {
          validators: Validators.required,
        }
      ),
      prices: new FormControl<ProductPrice[]>([]),
      paytraqId: new FormControl<number>(null),
      productionStages: new FormControl<JobProductionStage[]>([]),
    });

  }

  private nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      if (control.value === this.initialValue?.name) {
        return of(null);
      } else {
        return this.productService.validate('name', control.value.trim()).pipe(
          map(valid => valid ? null : { occupied: control.value })
        );
      }
    };
  }



}
