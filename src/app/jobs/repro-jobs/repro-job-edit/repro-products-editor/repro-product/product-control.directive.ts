import { Directive, Input, OnInit, Self } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DestroyService } from 'prd-cdk';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, pluck, takeUntil } from 'rxjs/operators';
import { CustomerProduct } from 'src/app/interfaces';
import { ProductFormGroup } from './product-form-group';
import { ReproProductComponent } from './repro-product.component';

@Directive({
  selector: 'app-repro-product[appProductControl]',
  providers: [DestroyService],
})
export class ProductControlDirective implements OnInit {

  control: ProductFormGroup = this.component.form;

  customerProducts$ = this.component.customerProducts$;

  @Input() set customerProducts(value: CustomerProduct[]) {
    if (!value) { return; }
    this.customerProducts$.next(value);
  }

  get unitsControl() { return this.control.get('units') as FormControl; }
  get nameControl() { return this.control.get('name') as FormControl; }
  get priceControl() { return this.control.get('price') as FormControl; }

  selectedProduct$: Observable<CustomerProduct>;

  constructor(
    private destroy$: DestroyService,
    @Self() private component: ReproProductComponent,
  ) { }

  ngOnInit(): void {

    this.selectedProduct$ = combineLatest([
      this.nameControl.valueChanges,
      this.customerProducts$,
    ]).pipe(
      debounceTime(300),
      map(([value, products]) => products.find(prod => prod.productName === value)),
      filter(product => !!product),
    );

    this.selectedProduct$.pipe(
      pluck('units'),
      takeUntil(this.destroy$),
    ).subscribe(units => this.unitsControl.setValue(units));

    this.selectedProduct$.pipe(
      pluck('price'),
      filter(_ => !this.priceControl.value),
      map(price => price || 0),
      takeUntil(this.destroy$),
    ).subscribe(price => this.priceControl.setValue(price));

  }

}
