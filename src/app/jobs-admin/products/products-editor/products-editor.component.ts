import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { ProductsFormService } from '../services/products-form.service';
import { PaytraqProductComponent } from './paytraq-product/paytraq-product.component';
import { ProductPricesComponent } from './product-prices/product-prices.component';
import { MatSelectModule } from '@angular/material/select';

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
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate {
  form = this.formService.form;

  product$ = this.route.data.pipe(
    map((data) => data.product as Product),
    takeUntilDestroyed()
  );

  paytraqDisabled$ = this.systemPreferences.preferences$.pipe(
    map((conf) => !conf.paytraq.enabled)
  );
  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;
  readonly units$ = this.systemPreferences.preferences$.pipe(
    map((conf) => conf.jobs.productUnits.filter((u) => !u.disabled))
  );

  get changes(): Partial<Product> | null {
    return this.formService.changes;
  }

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private systemPreferences: SystemPreferencesService,
    private formService: ProductsFormService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSave() {
    this.formService
      .save()
      .subscribe((c) =>
        this.router.navigate(['..', c._id], { relativeTo: this.route })
      );
  }

  onReset(): void {
    this.formService.reset();
  }

  ngOnInit(): void {
    this.product$.subscribe((customer) =>
      this.formService.setInitial(customer)
    );
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }
}
