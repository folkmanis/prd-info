import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { Product } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';
import { ProductsService } from 'src/app/services/products.service';
import { ProductFormService } from '../services/product-form.service';
import { SimpleFormDirective } from '../../services/simple-form.directive';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [ProductFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent extends SimpleFormDirective<Product> {

  readonly categories$ = this.productService.categories$;

  constructor(
    private productFormService: ProductFormService,
    private productService: ProductsService,
    private customersService: CustomersService,
    changeDetection: ChangeDetectorRef,
  ) {
    super(productFormService, changeDetection);
  }

  get name(): string {
    return this.value?.name;
  }

  readonly customers$ = this.customersService.customers$;

  onAddPrice(): void {
    this.productFormService.addPrice();
  }

  onDeletePrice(idx: number): void {
    this.productFormService.removePrice(idx);
  }

  onReset() {
    if (this.value._id) {
      super.onReset();
    } else {
      this.form.reset();
    }
  }


}
