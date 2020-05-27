import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Customer, ProductPrice, PriceChange } from 'src/app/interfaces';
import { cloneDeep, pick } from 'lodash';


@Component({
  selector: 'app-product-prices',
  templateUrl: './product-prices.component.html',
  styleUrls: ['./product-prices.component.css']
})
export class ProductPricesComponent implements OnInit {
  @Input('prices') set _pr(_pr: ProductPrice[]) {
    this.prices$.next(cloneDeep(_pr) || []);
  }
  /**
   * mainītais vai jaunais ieraksts
   * price === null, ja ieraksts dzēšams
   */
  @Output() priceChange: EventEmitter<PriceChange> = new EventEmitter();
  @Input('customers') set _customers(_cust: Customer[]) {
    this._customers$.next(_cust);
  }

  constructor(
    private fb: FormBuilder,
  ) { }

  priceForm: FormGroup = this.fb.group({
    customerName: [
      undefined,
      {
        validators: Validators.required,
      }
    ],
    price: [
      undefined,
      {
        validators: [Validators.required, Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)]
      }
    ],
  });

  edit: ProductPrice | undefined;
  readonly prices$: BehaviorSubject<ProductPrice[]> = new BehaviorSubject([]);
  private readonly _customers$: BehaviorSubject<Customer[]> = new BehaviorSubject([]);
  readonly customersFiltered$: Observable<Customer[]> = combineLatest([this._customers$, this.prices$]).pipe(
    map(([customers, prices]) => customers.filter(cust => !prices.find(pr => pr.customerName === cust.CustomerName)))
  );

  customers: Customer[];
  columns = ['customerName', 'price', 'action'];

  ngOnInit(): void {
  }

  onAppendPrice(): void {
    this.edit = { customerName: null, price: null };
    this.priceForm.setValue(this.edit);
    const _prices = this.prices$.value.concat(this.edit);
    this.prices$.next(_prices);
  }

  acceptEdit(): void {
    this.edit = undefined;
    this.priceChange.next(this.priceForm.value);
  }

  cancelEdit(): void {
    this.edit = undefined;
    const _prices = this.prices$.value;
    // Izdzēš tukšos
    this.prices$.next(_prices.filter(pr => pr.customerName));
  }

  onEditRow(rw: ProductPrice): void {
    this.priceForm.setValue(pick(rw, ['customerName', 'price']));
    this.edit = rw;
  }

  onDeleteRow(row: ProductPrice): void {
    this.priceChange.next({ customerName: row.customerName, price: null });
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.edit === undefined;
  }

}
