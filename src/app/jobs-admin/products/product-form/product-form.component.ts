import { Component, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productForm = this.formService.createForm();

  @Input()
  set product(product: Product) {
    if (!product) { return; }
    this.formService.setValue(this.productForm, product, { emitEvent: false });
    this._product = product;
  }
  get product(): Product { return this._product; }
  private _product: Product;

  @Output() productChanges = this.productForm.valueChanges.pipe(
    filter(_ => this.productForm.valid),
  );

  @Output() submitValue = new Subject<Product>();

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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.submitValue.complete();
  }

  onReset() {
    this.formService.setValue(this.productForm, this.product, { emitEvent: false });
  }

  onSave() {
    if (!this.productForm.valid) { return; }
    this.submitValue.next(this.productForm.value);
  }

}
