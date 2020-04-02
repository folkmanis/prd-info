import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, takeUntil } from 'rxjs/operators';
import { isEqual, pick, omit, keys } from 'lodash';

import { ProductsService } from '../services/products.service';
import { Product } from '../services/product';
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
  };
  productForm: FormGroup = this.fb.group(this.productFormControls);

  readonly categories$ = this.service.categories$;
  product: Product;
  product$: Observable<Product> = this.route.paramMap.pipe(
    map(paramMap => <string>paramMap.get('id')),
    filter(id => id && id.length === 24),
    switchMap(id => this.service.getProduct(id)),
    tap(prod => this.initForm(prod, this.productForm)),
    tap(prod => this.product = prod),
  );
  subs = new Subscription();

  ngOnInit(): void {
    this.subs.add(this.product$.subscribe());
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSave(): void {
    this.service.updateProduct(this.product._id, this.productForm.value).pipe(
      filter(resp => resp),
      tap(()=> this.product = {...this.product, ...this.productForm.value}),
      tap(() => this.productForm.markAsPristine()),
    )
      .subscribe();
  }

  onDelete(id: string): void {
    this.dialog.confirmDelete().pipe(
      filter(del => del),
      switchMap(() => this.service.deleteProduct(id)),
    ).subscribe(() => this.router.navigate(['..'], { relativeTo: this.route }));
  }

  onRestore(): void {
    this.initForm(this.product, this.productForm);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.productForm.pristine) {
      return true;
    }
    return this.dialog.discardChanges();
  }

  private initForm(prod: Product, form: FormGroup): void {
    form.reset(undefined, { emitEvent: false });
    form.patchValue(pick(prod, keys(form.value)), { emitEvent: false });
  }

}
