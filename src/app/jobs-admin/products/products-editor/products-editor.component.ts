import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, merge, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { MaterialsService } from '../../materials/services/materials.service';
import { ProductsFormService } from '../services/products-form.service';
import { PaytraqProductComponent } from './paytraq-product/paytraq-product.component';
import { ProductPricesComponent } from './product-prices/product-prices.component';
import { ProductProductionStagesComponent } from './product-production-stages/product-production-stages.component';

@Component({
  selector: 'app-products-editor',
  standalone: true,
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductsFormService],
  imports: [
    CommonModule,
    SimpleFormContainerComponent,
    ReactiveFormsModule,
    MaterialLibraryModule,
    PaytraqProductComponent,
    ProductPricesComponent,
    ProductProductionStagesComponent,
  ]
})
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate {


  form = this.formService.form;

  product$ = this.route.data.pipe(
    map(data => data.product as Product),
    takeUntilDestroyed(),
  );


  paytraqDisabled$ = this.systemPreferences.preferences$.pipe(
    map(conf => !conf.paytraq.enabled),
  );
  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;
  readonly units$ = this.systemPreferences.preferences$.pipe(
    map(conf => conf.jobs.productUnits.filter(u => !u.disabled)),
  );

  materials$ = this.materialsService.getMaterials();

  get changes(): Partial<Product> | null {
    return this.formService.changes;
  }


  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private systemPreferences: SystemPreferencesService,
    private formService: ProductsFormService,
    private router: Router,
    private route: ActivatedRoute,
    // private changeDetector: ChangeDetectorRef,
    private materialsService: MaterialsService,
  ) { }

  onSave() {
    this.formService.save()
      .subscribe(c => this.router.navigate(['..', c._id], { relativeTo: this.route }));
  }

  onReset(): void {
    this.formService.reset();
  }

  ngOnInit(): void {
    this.product$.subscribe(customer => this.formService.setInitial(customer));

    // merge(this.form.valueChanges, this.form.statusChanges).pipe(
    //   takeUntil(this.destroy$),
    // ).subscribe(() => this.changeDetector.markForCheck());
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }




}
