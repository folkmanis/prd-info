import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable, Subscription, Subject, merge, of } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, takeUntil, share, concatMap } from 'rxjs/operators';
import { isEqual, pick, omit, keys, cloneDeep } from 'lodash';

import { ProductsService, CustomersService } from 'src/app/services';
import { Product, ProductPrice, PriceChange } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ProductPricesComponent } from './product-prices/product-prices.component';
import { ProductFormGroup } from '../product-form';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  @ViewChild(ProductPricesComponent) private pricesComponent: ProductPricesComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ProductsService,
    private dialog: ConfirmationDialogService,
  ) { }

  readonly categories$ = this.service.categories$;

  productForm = new ProductFormGroup(this.priceAddFn);

  private readonly _subs = new Subscription();
  private _emit = false;
  private _saves = 0;

  ngOnInit(): void {
    this._subs.add(
      this.route.paramMap.pipe(
        tap(_ => this._emit = false),
        map(paramMap => paramMap.get('id') as string),
        filter(id => id && id.length === 24),
        switchMap(id => this.service.getProduct(id)),
        tap(prod => {
          this.productForm.reset(prod, { emitEvent: false });
          this.productForm.markAsPristine();
          this._emit = true;
          this._saves = 0;
        }),
      ).subscribe()
    );

    this._subs.add(
      this.productForm.valueChanges.pipe(
        filter(_ => this._emit && this.productForm.valid),
        debounceTime(500),
        tap(_ => this._saves++),
        concatMap((prod: Product) => this.service.updateProduct(prod._id, prod)),
        tap(_ => --this._saves || this.productForm.markAsPristine()),
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.productForm.pristine ? true : this.dialog.discardChanges();
  }

  priceAddFn(price?: ProductPrice): FormGroup {
    return new FormGroup({
      customerName: new FormControl(
        price?.customerName,
        Validators.required,
      ),
      price: new FormControl(
        price?.price,
        [Validators.required, Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)]
      ),
    });
  }

}
