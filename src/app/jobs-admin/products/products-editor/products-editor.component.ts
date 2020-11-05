import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IFormArray } from '@rxweb/types';
import { IAbstractControl } from '@rxweb/types/reactive-form/i-abstract-control';
import { Observable } from 'rxjs';
import { Product, ProductPrice } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersService, ProductsService } from 'src/app/services';
import { ProductFormService } from '../services/product-form.service';


@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements CanComponentDeactivate {

  constructor(
    private customersService: CustomersService,
    private productService: ProductsService,
    private productFormService: ProductFormService,
  ) {  }

  form = this.productFormService.form;

  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;

  onAddPrice(frm:  IAbstractControl<ProductPrice[], Product>): void {
    this.productFormService.addPrice(frm as IFormArray<ProductPrice>);
  }

  onDeletePrice(frm: IAbstractControl<ProductPrice[], Product>, idx: number): void {
    this.productFormService.removePrice(frm as IFormArray<ProductPrice>, idx);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine || this.productFormService.isNew();
  }

}
