import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subscription, Subject, merge, of } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, takeUntil, share } from 'rxjs/operators';
import { isEqual, pick, omit, keys, cloneDeep } from 'lodash';

import { ProductsService } from '../services/products.service';
import { Product, ProductPrice, PriceChange } from "../services/product";
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { LoginService } from 'src/app/login/login.service';
import { JobsSettings } from 'src/app/library/classes/system-preferences-class';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, CanComponentDeactivate {

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
  readonly categories$ = this.service.categories$;
  private _id: string;
  private changes$: Subject<Partial<Product> | undefined> = new Subject();

  id$: Observable<string> = this.route.paramMap.pipe(
    map(paramMap => <string>paramMap.get('id')),
    filter(id => id && id.length === 24),
    tap(id => this._id = id),
  );

  customers$ = this.service.getCustomers();
  subs = new Subscription();

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
    // this.subs.add(this.product$.subscribe());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onPriceChange(changes: PriceChange) {
    if (changes.price === null) {
      this.productForm.patchValue({
        prices: (<ProductPrice[]>this.productForm.value.prices).filter(pr => pr.name !== changes.name)
      });
    }
    // TODO
    this.productForm.markAsDirty();
    console.log(changes);
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
    this.changes$.next()
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.productForm.pristine) {
      return true;
    }
    return this.dialog.discardChanges();
  }

}
