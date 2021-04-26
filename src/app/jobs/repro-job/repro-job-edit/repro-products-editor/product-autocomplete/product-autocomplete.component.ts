import { Component, OnInit, Input, Self, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgControl, ControlValueAccessor, FormControl, ControlContainer } from '@angular/forms';
import { CustomerProduct, JobProduct } from 'src/app/interfaces';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { startWith, map, share, shareReplay, tap, filter } from 'rxjs/operators';
import { IControlValueAccessor, IFormControl } from '@rxweb/types';

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

  @Input('control') productsControl: IFormControl<string>;

  private customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

  constructor() { }

  invalidProduct$: Observable<string | undefined>;

  private filteredProducts$: Observable<CustomerProduct[]>;
  firstProducts$: Observable<CustomerProduct[]>;
  restProducts$: Observable<CustomerProduct[]>;

  ngOnInit(): void {

    this.filteredProducts$ = combineLatest([
      this.productsControl.valueChanges.pipe(startWith('')),
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

    this.invalidProduct$ = this.productsControl.statusChanges.pipe(
      map(_ => this.productsControl.hasError('invalidProduct') ? undefined : this.productsControl.getError('invalidProduct')),
    );
  }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

  private filterProducts([control, products]: [string, CustomerProduct[]]): CustomerProduct[] {
    return products.filter(pr => pr.productName.toUpperCase().includes(control.toUpperCase()));
  }

}
