import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject, pipe } from 'rxjs';
import { map, switchMap, takeUntil, finalize, tap } from 'rxjs/operators';
import { Product, ProductPrice } from 'src/app/interfaces';
import { CustomersService, ProductsService } from 'src/app/services';
import { SimpleFormDirective } from '../simple-form.directive';
import { DestroyService } from 'src/app/library/rx/destroy.service';

import { ProductFormService } from '../services/product-form.service';
import { IFormArray } from '@rxweb/types';
import { IAbstractControl } from '@rxweb/types/reactive-form/i-abstract-control';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';


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
