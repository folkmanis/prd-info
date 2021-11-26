import { Directive, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, map, pluck, takeUntil } from 'rxjs/operators';
import { CustomerProduct, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { DestroyService, log } from 'prd-cdk';
import { ProductFormGroup } from '../../services/product-form-group';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appProductControl]',
  providers: [DestroyService],
})
export class ProductControlDirective implements OnInit {

  @Input('appProductControl') control: ProductFormGroup;

  @Output() customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

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
    ).subscribe(units => this.unitsControl.setValue(units, { emitEvent: false }));

    this.selectedProduct$.pipe(
      pluck('price'),
      filter(_ => !this.priceControl.value),
      map(price => price || 0),
      takeUntil(this.destroy$),
    ).subscribe(price => this.priceControl.setValue(price));

  }

}
