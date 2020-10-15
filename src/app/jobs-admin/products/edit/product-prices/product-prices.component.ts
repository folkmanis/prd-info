import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, ValidatorFn, ValidationErrors, ControlContainer } from '@angular/forms';
import { IFormBuilder, IFormGroup, IFormArray } from '@rxweb/types';
import { ProductPrice } from 'src/app/interfaces';
import { Customer, CustomerPartial, NewCustomer } from 'src/app/interfaces';
import { ProductFormService } from '../../services/product-form.service';


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

  constructor(
    private controlContainer: ControlContainer,
    private productFormService: ProductFormService,
  ) { }

  pricesForm: IFormArray<ProductPrice>;

  ngOnInit(): void {
    this.pricesForm = this.controlContainer.control as IFormArray<ProductPrice>;
  }

  onAppendPrice(): void {
    this.productFormService.addPrice(this.pricesForm);
    // this.pricesForm.markAsDirty();
  }

  onDeleteRow(idx: number): void {
    this.productFormService.removePrice(this.pricesForm, idx);
    // this.pricesForm.markAsDirty();
  }

}
