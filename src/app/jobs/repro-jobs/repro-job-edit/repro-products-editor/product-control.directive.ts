import { Directive, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IFormControl, IFormGroup } from '@rxweb/types';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, map, pluck, takeUntil } from 'rxjs/operators';
import { CustomerProduct, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { DestroyService, log } from 'prd-cdk';

@Directive({
  selector: '[appProductControl]',
  providers: [DestroyService],
})
export class ProductControlDirective implements OnInit {

  @Input('appProductControl') control: IFormGroup<JobProduct>;

  @Output() customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

  @Input() set customerProducts(value: CustomerProduct[]) {
    if (!value) { return; }
    this.customerProducts$.next(value);
  }

  get unitsControl() { return this.control.get('units') as unknown as IFormControl<string>; }
  get nameControl() { return this.control.get('name') as unknown as IFormControl<string>; }
  get priceControl() { return this.control.get('price') as unknown as IFormControl<number>; }

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
      filter(price => price && !this.priceControl.value),
      takeUntil(this.destroy$),
    ).subscribe(price => this.priceControl.setValue(price));

  }

}
