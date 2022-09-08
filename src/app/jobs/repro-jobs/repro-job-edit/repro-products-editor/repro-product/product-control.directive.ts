import { Directive, Input, OnInit, Self } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { CustomerProduct } from 'src/app/interfaces';
import { ReproProductComponent } from './repro-product.component';

@Directive({
  selector: 'app-repro-product[appProductControl]',
  providers: [DestroyService],
})
export class ProductControlDirective implements OnInit {

  control = this.component.form;

  customerProducts$ = this.component.customerProducts$;

  @Input() set customerProducts(value: CustomerProduct[]) {
    this.customerProducts$.next(value || []);
  }

  selectedProduct$: Observable<CustomerProduct>;

  constructor(
    private destroy$: DestroyService,
    @Self() private component: ReproProductComponent,
  ) { }

  ngOnInit(): void {

    this.selectedProduct$ = combineLatest([
      this.control.controls.name.valueChanges,
      this.customerProducts$,
    ]).pipe(
      debounceTime(300),
      map(([value, products]) => products.find(prod => prod.productName === value)),
      filter(product => !!product),
    );

    this.selectedProduct$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(({ units }) => this.control.controls.units.setValue(units));

    this.selectedProduct$.pipe(
      map(product => product.price),
      map(price => price || 0),
      takeUntil(this.destroy$),
    ).subscribe(price => this.control.controls.price.setValue(price));

  }


}
