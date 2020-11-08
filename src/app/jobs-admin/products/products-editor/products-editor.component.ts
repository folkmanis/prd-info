import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormArray, IFormGroup } from '@rxweb/types';
import { IAbstractControl } from '@rxweb/types/reactive-form/i-abstract-control';
import { Observable } from 'rxjs';
import { Product, ProductPrice } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersService, ProductsService } from 'src/app/services';
import { ProductsFormSource } from '../services/products-form-source';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private fb: FormBuilder,
  ) { }

  formSource = new ProductsFormSource(this.fb, this.productService);
  get form(): IFormGroup<Product> { return this.formSource.form; }

  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;

  get isNew(): boolean { return this.formSource.isNew; }

  ngOnInit(): void {
  }

  onAddPrice(frm: IAbstractControl<ProductPrice[], Product>): void {
    this.formSource.addPrice(frm as IFormArray<ProductPrice>);
  }

  onDeletePrice(frm: IAbstractControl<ProductPrice[], Product>, idx: number): void {
    this.formSource.removePrice(frm as IFormArray<ProductPrice>, idx);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine; // || this.productFormService.isNew();
  }

}
