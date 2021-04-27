import { Component, OnInit, Input, Self, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgControl, ControlValueAccessor, FormControl, ControlContainer, FormGroup } from '@angular/forms';
import { CustomerProduct, JobProduct } from 'src/app/interfaces';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { startWith, map, share, shareReplay, tap, filter, debounceTime, distinctUntilChanged, pluck, takeUntil } from 'rxjs/operators';
import { IControlValueAccessor, IFormControl, IFormGroup } from '@rxweb/types';
import { log, DestroyService } from 'prd-cdk';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class ProductAutocompleteComponent implements OnInit {
  @ViewChild('name') private inputElement: ElementRef;

  @Input() set customerProducts(val: CustomerProduct[]) {
    if (!(val instanceof Array)) { return; }
    this.customerProducts$.next(val);
  }

  @Input('control') productNameControl: IFormControl<string>;

  private customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

  constructor(
    private destroy$: DestroyService,
  ) { }

  private filteredProducts$: Observable<CustomerProduct[]>;
  firstProducts$: Observable<CustomerProduct[]>;
  restProducts$: Observable<CustomerProduct[]>;

  get unitsControl(): IFormControl<string> {
    return this.productNameControl.parent.get('units') as IFormControl<string>;
  }

  ngOnInit(): void {

    this.filteredProducts$ = combineLatest([
      this.productNameControl.valueChanges.pipe(startWith('')),
      this.customerProducts$,
    ]).pipe(
      map(this.filterProducts),
      shareReplay(1),
    );
    this.firstProducts$ = this.filteredProducts$.pipe(
      map(prod => prod.filter(pr => pr.price !== undefined))
    );
    this.restProducts$ = this.filteredProducts$.pipe(
      map(prod => prod.filter(pr => pr.price === undefined))
    );

    combineLatest([
      this.productNameControl.valueChanges,
      this.customerProducts$,
    ]).pipe(
      debounceTime(300),
      map(([value, products]) => products.find(prod => prod.productName === value)),
      pluck('units'),
      filter(units => !!units),
      takeUntil(this.destroy$),
    ).subscribe(units => this.unitsControl.setValue(units, { emitEvent: false }));

  }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

  private filterProducts([control, products]: [string, CustomerProduct[]]): CustomerProduct[] {
    return products.filter(pr => pr.productName.toUpperCase().includes(control.toUpperCase()));
  }

}
