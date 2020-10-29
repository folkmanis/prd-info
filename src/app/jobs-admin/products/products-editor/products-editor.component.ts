import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { Product } from 'src/app/interfaces';
import { CustomersService, ProductsService } from 'src/app/services';
import { SimpleFormDirective } from '../../services/simple-form.directive';
import { DestroyService } from 'src/app/library/rx/destroy.service';

import { ProductFormService } from '../services/product-form.service';


@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent
  extends SimpleFormDirective<Product>
  implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private productService: ProductsService,
    private productFormService: ProductFormService,
  ) {
    super(productFormService);
  }

  readonly categories$ = this.productService.categories$;
  readonly customers$ = this.customersService.customers$;

  onSave() {
    const prod = this.form.value;
    if (prod._id) {
      this.productService.updateProduct(prod._id, prod).pipe(
        switchMap(_ => this.productService.getProduct(prod._id)),
      )
        .subscribe(res => {
          this.initialValue = res;
        }
        );
    } else {
      this.productService.insertProduct(prod).pipe(
      )
        .subscribe(res => {
          this.form.markAsPristine();
          this.router.navigate(['..', res], { relativeTo: this.route });
        });
    }
  }

  onAddPrice(): void {
    this.productFormService.addPrice();
  }

  onDeletePrice(idx: number): void {
    this.productFormService.removePrice(idx);
  }


}
