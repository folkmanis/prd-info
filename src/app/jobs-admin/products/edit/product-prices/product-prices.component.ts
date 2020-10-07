import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProductPrice } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';


@Component({
  selector: 'app-product-prices',
  templateUrl: './product-prices.component.html',
  styleUrls: ['./product-prices.component.scss']
})
export class ProductPricesComponent implements OnInit, AfterViewInit {

  @Input() set pricesForm(arr: FormArray) {
    this._formArray = arr;
  }
  get pricesForm(): FormArray {
    return this._formArray;
  }
  private _formArray: FormArray;

  @Input() priceAddFn: () => FormGroup;

  constructor(
    private customersService: CustomersService,
  ) { }

  customers$ = this.customersService.customers$;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  isAddFn(): boolean {
    return typeof this.priceAddFn === 'function';
  }

  onAppendPrice(): void {
    this.pricesForm.push(this.priceAddFn());
    this.pricesForm.markAsDirty();
  }

  onDeleteRow(idx: number): void {
    this.pricesForm.removeAt(idx);
    this.pricesForm.markAsDirty();
  }

}
