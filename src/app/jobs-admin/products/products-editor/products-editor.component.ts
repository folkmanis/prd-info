import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { MaterialsService } from '../../materials/services/materials.service';
import { ProductProductionComponent } from '../product-production/product-production.component';
import { ProductsFormService } from '../services/products-form.service';
import { PaytraqProductComponent } from './paytraq-product/paytraq-product.component';
import { ProductPricesComponent } from './product-prices/product-prices.component';

@Component({
  selector: 'app-products-editor',
  standalone: true,
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductsFormService],
  imports: [
    SimpleFormContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    PaytraqProductComponent,
    ProductPricesComponent,
    ProductProductionComponent,
    RouterLink,
    AsyncPipe,
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
  form = this.formService.form;

  product = input.required<Product>();

  paytraqEnabled = configuration('paytraq', 'enabled');
  units = configuration('jobs', 'productUnits');

  categories$ = inject(ProductsService).categories$;
  customers$ = inject(CustomersService).customers$;
  materials$ = inject(MaterialsService).getMaterials();

  productionStages$ = inject(ProductionStagesService).getProductionStages();

  get changes(): Partial<Product> | null {
    return this.formService.changes;
  }

  constructor(
    private formService: ProductsFormService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      this.formService.setInitial(this.product());
    }, { allowSignalWrites: true });
  }

  onSave() {
    this.formService
      .save()
      .subscribe((product) =>
        this.router.navigate(['..', product._id], { relativeTo: this.route })
      );
  }

  onReset(): void {
    this.formService.reset();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return !this.changes; // || this.productFormService.isNew();
  }
}
