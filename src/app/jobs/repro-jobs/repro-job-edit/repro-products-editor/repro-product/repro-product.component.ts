import { Output, Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, Self } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { DestroyService } from 'prd-cdk';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Observable, pluck, Subject, takeUntil } from 'rxjs';
import { CustomerProduct } from 'src/app/interfaces';
import { ProductFormGroup } from '../../../services/product-form-group';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-repro-product',
  templateUrl: './repro-product.component.html',
  styleUrls: ['./repro-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproProductComponent implements OnInit {

  @ViewChild(ProductAutocompleteComponent)
  productNameControl: ProductAutocompleteComponent;

  @Input() disabled = false;

  @Input() control: ProductFormGroup;

  private customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);
  @Input('customerProducts')
  set customerProducts(value: CustomerProduct[]) {
    this.customerProducts$.next(value || []);
  }
  get customerProducts() {
    return this.customerProducts$.value;
  }

  @Output() remove = new Subject<void>();

  small$ = this.layout.isSmall$;

  get nameControl() { return this.control.get('name') as FormControl; }
  get priceControl() { return this.control.get('price') as FormControl; }
  get unitsControl() { return this.control.get('units') as FormControl; }

  private selectedProduct$: Observable<CustomerProduct>;


  constructor(
    private destroy$: DestroyService,
    private layout: LayoutService,
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

  focus() {
    this.productNameControl.focus();
  }

  onAddPrice() {
    const price = this.customerProducts.find(prod => prod.productName === this.control.value.name)?.price;
    if (price) {
      this.control.patchValue({ price });
      this.control.get('price').markAsDirty();
    }
  }



}
