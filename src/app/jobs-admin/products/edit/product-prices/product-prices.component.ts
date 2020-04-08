import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ProductPrice, PriceChange } from '../../services/product';
import { Customer } from '../../../services/jobs-admin.interfaces';
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
  @Output() priceChange: EventEmitter<PriceChange> = new EventEmitter;
  @Input('customers') set _customers(_cust: Customer[]) {
    this._customers$.next(_cust);
  }

  constructor(
    private fb: FormBuilder,
  ) { }

  priceForm: FormGroup = this.fb.group({
    name: [
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
  readonly customersFiltered$: Observable<Customer[]> = combineLatest(this._customers$, this.prices$).pipe(
    map(([customers, prices]) => customers.filter(cust => !prices.find(pr => pr.name === cust.CustomerName)))
  );

  customers: Customer[];
  columns = ['name', 'price', 'action'];

  ngOnInit(): void {
  }

  onAppendPrice(): void {
    this.edit = { name: null, price: null };
    this.priceForm.setValue(this.edit);
    const _prices = this.prices$.value.concat(this.edit);
    this.prices$.next(_prices);
  }

  acceptEdit(): void {
    this.edit = undefined;
    this.priceChange.next(this.priceForm.value);
  }

  onEditRow(rw: ProductPrice): void {
    this.priceForm.setValue(pick(rw, ['name', 'price']));
    this.edit = rw;
  }

  onDeleteRow(row: ProductPrice): void {
    this.priceChange.next({ name: row.name, price: null });
  }

}
