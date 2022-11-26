import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { map, merge, Observable, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersService, ProductsService } from 'src/app/services';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { ProductsFormService } from '../services/products-form.service';
import { MaterialsService } from '../../materials/services/materials.service';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductsFormService, DestroyService]
})
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate {


  form = this.formService.form;

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
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef,
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
    this.route.data.pipe(
      map(data => data.value as Product),
      takeUntil(this.destroy$),
    ).subscribe(customer => this.formService.setInitial(customer));

    merge(this.form.valueChanges, this.form.statusChanges).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }




}
