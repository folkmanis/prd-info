import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { Product } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersService, ProductsService } from 'src/app/services';
import { SimpleFormDirective } from '../../services/simple-form.directive';
import { DestroyService } from 'src/app/library/rx/destroy.service';

import { ProductFormService } from '../services/product-form.service';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  providers: [ProductFormService, DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent extends SimpleFormDirective<Product> implements OnInit, OnDestroy, CanComponentDeactivate {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: ConfirmationDialogService,
    private customersService: CustomersService,
    private productService: ProductsService,
    private productFormService: ProductFormService,
    private destroy$: DestroyService,
  ) {
    super(productFormService);
  }

  readonly categories$ = this.productService.categories$;

  private readonly _productUpdate$ = new Subject<Partial<Product>>();
  product$: Observable<Partial<Product>> = merge(
    this.route.data.pipe(map(data => data.product as Partial<Product>)),
    this._productUpdate$
  );
  readonly customers$ = this.customersService.customers$;


  ngOnInit(): void {
    this.product$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(prod => this.value = prod);
  }

  ngOnDestroy() {
    this._productUpdate$.complete();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine ? true : this.dialog.discardChanges();
  }

  onSave(prod: Product) {
    if (prod._id) {
      this.productService.updateProduct(prod._id, prod).pipe(
        switchMap(_ => this.productService.getProduct(prod._id)),
      )
        .subscribe(res => {
          this._productUpdate$.next(res);
        }
        );
    } else {
      this.productService.insertProduct(prod).pipe(
      )
        .subscribe(res => {
          this.form.markAsPristine();
          this.router.navigate(['jobs-admin', 'products', res]);
        });
    }
  }

  get name(): string {
    return this.value?.name;
  }


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
