import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductPrice, PriceChange } from '../../services/product';
import { Customer } from '../../../services/jobs-admin.interfaces';


@Component({
  selector: 'app-product-prices',
  templateUrl: './product-prices.component.html',
  styleUrls: ['./product-prices.component.css']
})
export class ProductPricesComponent implements OnInit {
  @Input('prices') set _prices(_pr: ProductPrice[]) {
    this.prices = _pr || [];
    console.table(this.prices);
  }
  /**
   * mainītais vai jaunais ieraksts
   * price === null, ja ieraksts dzēšams
   */
  @Output() priceChange: EventEmitter<PriceChange> = new EventEmitter;
  @Input('customers') set _customers(_cust: Customer[]) {
    this.customers = _cust;
    console.log(this.customers);
  }

  prices: ProductPrice[] = [];
  customers: Customer[];
  columns = ['name', 'price', 'deleteRow'];

  constructor() { }

  ngOnInit(): void {
  }

  onAppendPrice(): void {

  }

  onDeleteRow(row: ProductPrice): void {
    this.priceChange.next({name: row.name, price: null})
  }

}
