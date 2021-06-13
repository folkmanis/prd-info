import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { CustomerProduct } from 'src/app/interfaces';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAutocompleteComponent implements OnInit {
  @ViewChild('name') private inputElement: ElementRef;

  @Input() set customerProducts(val: CustomerProduct[]) {
    if (!(val instanceof Array)) { return; }
    this.customerProducts$.next(val);
  }

  @Input('control') productNameControl: FormControl;

  private customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

  constructor() { }

  private filteredProducts$: Observable<CustomerProduct[]>;
  firstProducts$: Observable<CustomerProduct[]>;
  restProducts$: Observable<CustomerProduct[]>;

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

  }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

  private filterProducts([control, products]: [string, CustomerProduct[]]): CustomerProduct[] {
    return products.filter(pr => pr.productName.toUpperCase().includes(control.toUpperCase()));
  }

}
