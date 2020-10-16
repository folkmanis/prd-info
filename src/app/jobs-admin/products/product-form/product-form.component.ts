import {
  Component,
  Input, Output,
  OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import { IFormBuilder, IFormGroup, IFormArray } from '@rxweb/types';
import { Product, ProductPrice } from 'src/app/interfaces';
import { ProductFormService } from '../services/product-form.service';
import { filter, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [ProductFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {

  productForm = this.formService.form;

  @Input()
  set product(product: Partial<Product>) {
    if (!product) { return; }
    this.formService.setValue(product, { emitEvent: false });
    this._product = product;
  }
  get product(): Partial<Product> { return this._product; }
  private _product: Partial<Product>;

  @Output() productChanges = this.productForm.valueChanges.pipe(
    filter(_ => this.productForm.valid),
  );

  @Output() submitValue = new EventEmitter<Product>();

  get pristine(): boolean {
    return this.productForm.pristine;
  }
  set pristine(pristine: boolean) {
    pristine ? this.productForm.markAsPristine() : this.productForm.markAsDirty();
    this.changeDetection.markForCheck();
  }

  readonly categories$ = this.productService.categories$;

  constructor(
    private formService: ProductFormService,
    private productService: ProductsService,
    private customersService: CustomersService,
    private changeDetection: ChangeDetectorRef,
  ) { }

  readonly customers$ = this.customersService.customers$;

  onReset() {
    if (this.product._id) {
      this.formService.setValue(this.product, { emitEvent: false });
    } else {
      this.productForm.reset();
    }
  }

  onSave() {
    if (!this.productForm.valid) { return; }
    this.submitValue.next(this.formService.value);
  }

  onAddPrice(): void {
    this.formService.addPrice();
  }

  onDeletePrice(idx: number): void {
    this.formService.removePrice(idx);
  }


}
