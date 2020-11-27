import { Component, OnInit, Input, Self, ViewChild, ElementRef } from '@angular/core';
import { NgControl, ControlValueAccessor, FormControl } from '@angular/forms';
import { CustomerProduct, JobProduct } from 'src/app/interfaces';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { startWith, map, share, shareReplay, tap, filter } from 'rxjs/operators';
import { IControlValueAccessor, IFormControl } from '@rxweb/types';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss']
})
export class ProductAutocompleteComponent implements OnInit, IControlValueAccessor<string> {
  @ViewChild('name') private inputElement: ElementRef;

  @Input() set customerProducts(val: CustomerProduct[]) {
    if (!(val instanceof Array)) { return; }
    this.customerProducts$.next(val);
  }

  private customerProducts$ = new BehaviorSubject<CustomerProduct[]>([]);

  constructor(
    @Self() private ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;
  }

  productsControl: IFormControl<string> = new FormControl('');
  invalidProduct$: Observable<string | undefined>;

  private filteredProducts$: Observable<CustomerProduct[]> = combineLatest([
    this.productsControl.valueChanges.pipe(startWith('')),
    this.customerProducts$,
  ]).pipe(
    map(this.filterProducts),
    shareReplay(1),
  );
  firstProducts$: Observable<CustomerProduct[]> = this.filteredProducts$.pipe(
    map(prod => prod.filter(pr => pr.price !== undefined))
  );
  restProducts$: Observable<CustomerProduct[]> = this.filteredProducts$.pipe(
    map(prod => prod.filter(pr => pr.price === undefined))
  );


  private onChange: (val: string) => void;
  onTouched: () => void;

  ngOnInit(): void {
    this.invalidProduct$ = this.ngControl.statusChanges.pipe(
      map(_ => this.ngControl.hasError('invalidProduct') ? undefined : this.ngControl.getError('invalidProduct')),
    );
    this.productsControl.valueChanges.subscribe(val => this.onChange(val));
  }

  writeValue(obj: string) {
    this.productsControl.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: (val: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    if (isDisabled) {
      this.productsControl.disable();
    } else {
      this.productsControl.enable();
    }
  }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

  private filterProducts([control, products]: [string, CustomerProduct[]]): CustomerProduct[] {
    return products.filter(pr => pr.productName.toUpperCase().includes(control.toUpperCase()));
  }

}
