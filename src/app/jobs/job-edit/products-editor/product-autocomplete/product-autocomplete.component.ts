import { Component, OnInit, Input, Self, ViewChild, ElementRef } from '@angular/core';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { CustomerProduct } from 'src/app/interfaces';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map, share, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.css']
})
export class ProductAutocompleteComponent implements OnInit, ControlValueAccessor {
  @ViewChild('name') private inputElement: ElementRef;
  @Input() customerProducts$: Observable<CustomerProduct[]>;

  constructor(
    @Self() public ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;
  }
  private filteredProducts$: Observable<CustomerProduct[]>;
  firstProducts$: Observable<CustomerProduct[]>;
  restProducts$: Observable<CustomerProduct[]>;

  ngOnInit(): void {
    this.filteredProducts$ = combineLatest([
      this.ngControl.valueChanges.pipe(startWith('')),
      this.customerProducts$,
    ]).pipe(
      map(([control, products]) => products.filter(pr => pr.productName.toUpperCase().indexOf((control as string).toUpperCase()) !== -1)),
      shareReplay(1),
    );
    this.firstProducts$ = this.filteredProducts$.pipe(
      map(prod => prod.filter(pr => pr.price !== undefined))
    );
    this.restProducts$ = this.filteredProducts$.pipe(
      map(prod => prod.filter(pr => pr.price === undefined))
    );

  }

  writeValue(obj: any) { }

  registerOnChange(fn: any) { }

  registerOnTouched(fn: any) { }

  setDisabledState?(isDisabled: boolean) { }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

}
