import { Component, OnInit, Input } from '@angular/core';
import { FormArray, Validators, ValidatorFn, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ProductPriceImport } from '../../services';


@Component({
  selector: 'app-import-new-prices',
  templateUrl: './import-new-prices.component.html',
  styleUrls: ['./import-new-prices.component.css']
})
export class ImportNewPricesComponent {
  @Input() pricesForm: FormArray;
  @Input()
  get products() { return this._prod; }
  set products(pr: ProductPriceImport[]) {
    this._prod = pr;
    this.updatePricesForm();
    this.dataSource$.next(this.products);
  }

  private _prod: ProductPriceImport[];

  dataSource$ = new Subject<ProductPriceImport[]>();
  displayedColumns = ['product', 'customerName', 'price'];

  get controls(): FormControl[] { return this.pricesForm.controls as FormControl[]; }

  constructor(
  ) { }

  /** Aizpilda formu ar precēm */
  updatePricesForm(): void {
    this.pricesForm.clear();
    for (const prod of this.products) {
      this.pricesForm.push(
        new FormControl(undefined, {
          validators: [
            Validators.required,
            Validators.min(0),
          ]
        })
      );
    }
  }

}
