import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subscription, Subject, merge, of } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, takeUntil, share } from 'rxjs/operators';
import { isEqual, pick, omit, keys, cloneDeep } from 'lodash';

import { ProductsService } from '../services/products.service';
import { Product, ProductPrice, PriceChange } from "../services/product";
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ProductPricesComponent } from './product-prices/product-prices.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, CanComponentDeactivate {
@ViewChild(ProductPricesComponent) pricesComponent: ProductPricesComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ProductsService,
    private dialog: ConfirmationDialogService,
  ) { }

  private readonly productFormControls: { [key: string]: any; } = {
    category: [''],
    description: [''],
    prices: [],
  };
  productForm: FormGroup = this.fb.group(this.productFormControls);
  get pricesForm(): AbstractControl { return this.productForm.get('prices'); }
  
  readonly categories$ = this.service.categories$;
  private _id: string;
  private changes$: Subject<Partial<Product> | undefined> = new Subject();

  id$: Observable<string> = this.route.paramMap.pipe(
    map(paramMap => <string>paramMap.get('id')),
    filter(id => id && id.length === 24),
    tap(id => this._id = id),
  );

  customers$ = this.service.getCustomers();

  product$: Observable<Product> = merge(this.id$,
    this.changes$.pipe(
      switchMap(chgs => chgs ? this.service.updateProduct(this._id, chgs) : of(true)),
      filter(resp => resp),
      map(() => this._id),
    )
  ).pipe(
    switchMap(id => this.service.getProduct(id)),
    tap(prod => {
      this.productForm.reset(pick(prod, keys(this.productForm.value)), { emitEvent: false });
      this.productForm.markAsPristine();
    })
  );

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onPriceChange(changes: PriceChange) {
    this.productForm.markAsDirty();
    const prices = (<ProductPrice[]>this.productForm.value.prices) || [];
    if (changes.price === null) {
      this.productForm.patchValue({
        prices: prices.filter(pr => pr.name !== changes.name)
      });
      return;
    }
    const idx = prices.findIndex(pr => pr.name === changes.name);
    if (idx === -1) {
      this.pricesForm.setValue(prices.concat(changes));
    } else {
      const newPrices = [...prices];
      newPrices[idx] = changes;
      this.pricesForm.setValue(newPrices);
    }
  }

  onSave(): void {
    this.changes$.next(this.productForm.value);
  }

  onDelete(id: string): void {
    this.dialog.confirmDelete().pipe(
      filter(del => del),
      switchMap(() => this.service.deleteProduct(id)),
    ).subscribe(() => this.router.navigate(['..'], { relativeTo: this.route }));
  }

  onRestore(): void {
    this.changes$.next();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.productForm.pristine && this.pricesComponent.canDeactivate()) {
      return true;
    } else {
      return this.dialog.discardChanges();
    }
  }

}
