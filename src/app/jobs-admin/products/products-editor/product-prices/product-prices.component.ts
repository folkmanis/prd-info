import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { IFormArray } from '@rxweb/types';
import { CustomerPartial, ProductPrice } from 'src/app/interfaces';


@Component({
  selector: 'app-product-prices',
  templateUrl: './product-prices.component.html',
  styleUrls: ['./product-prices.component.scss']
})
export class ProductPricesComponent implements OnInit {
  @Input()
  get customers(): CustomerPartial[] { return this._customers; }
  set customers(customers: CustomerPartial[]) {
    if (customers) { this._customers = customers; }
  }
  private _customers: CustomerPartial[] = [];

  @Output() addPrice = new EventEmitter<void>();
  @Output() removePrice = new EventEmitter<number>();

  constructor(
    private controlContainer: ControlContainer,
  ) { }

  pricesForm: IFormArray<ProductPrice>;

  ngOnInit(): void {
    this.pricesForm = this.controlContainer.control as IFormArray<ProductPrice>;
  }


}
