import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { isEqual, pickBy } from 'lodash-es';
import { Observable } from 'rxjs';
import { NewProduct, Product, ProductPrice, ProductProductionStage } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { MaterialsService } from '../../materials/services/materials.service';
import { ProductsListComponent } from '../products-list/products-list.component';
import { PaytraqProductComponent } from './paytraq-product/paytraq-product.component';
import { ProductPricesComponent } from './product-prices/product-prices.component';
import { ProductProductionComponent } from './product-production/product-production.component';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleFormContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    PaytraqProductComponent,
    ProductPricesComponent,
    ProductProductionComponent,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatOptionModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class ProductsEditorComponent implements CanComponentDeactivate {
  #listComponent = inject(ProductsListComponent);

  #productService = inject(ProductsService);

  #navigate = navigateRelative();
  #dialog = inject(ConfirmationDialogService);

  form = inject(FormBuilder).group({
    inactive: [false],
    category: ['', [Validators.required]],
    name: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [this.#nameAsyncValidator()],
      },
    ],
    description: [''],
    units: ['', [Validators.required]],
    prices: [[] as ProductPrice[]],
    paytraqId: [null as number | null],
    productionStages: [[] as ProductProductionStage[]],
  });

  product = input.required<Product>();
  id = input<string>();

  initialValue = linkedSignal(() => this.product());

  paytraqEnabled = configuration('paytraq', 'enabled');
  units = configuration('jobs', 'productUnits');
  categories = configuration('jobs', 'productCategories');

  customers = inject(CustomersService).getCustomersResource({ disabled: false }).asReadonly();
  materials = inject(MaterialsService).getMaterialsResource().asReadonly();
  productionStages = inject(ProductionStagesService).getProductionStagesResource();

  valueChanges = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  changes = computed(() => {
    const initialValue = this.initialValue();
    const diff = pickBy(this.valueChanges(), (value, key) => !isEqual(value, initialValue[key]));
    return Object.keys(diff).length ? diff : null;
  });

  constructor() {
    effect(() => {
      this.form.reset(this.initialValue());
    });
  }

  async onSave() {
    const id = this.id();
    const changes = this.changes();
    try {
      if (id && changes) {
        const updated = await this.#productService.updateProduct(id, changes);
        this.initialValue.set(updated);
        this.form.markAsPristine();
        this.#listComponent.onReload();
      } else {
        const inserted = await this.#productService.insertProduct(this.form.value as NewProduct);
        this.form.markAsPristine();
        this.#listComponent.onReload();
        this.#navigate(['..', inserted._id]);
      }
    } catch (error) {
      this.#dialog.confirmDataError(error.message);
    }
  }

  onReset(): void {
    this.form.reset(this.initialValue());
  }

  canDeactivate(): Observable<boolean> | boolean {
    return !this.changes() || this.form.pristine;
  }

  #nameAsyncValidator(): AsyncValidatorFn {
    return async (control) => {
      if (control.value === this.initialValue()?.name) {
        return null;
      } else {
        const valid = await this.#productService.validate('name', control.value.trim());
        return valid ? null : { occupied: control.value };
      }
    };
  }
}
