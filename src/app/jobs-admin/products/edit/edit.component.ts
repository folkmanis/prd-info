import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Product, ProductPrice } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { ProductsService } from 'src/app/services';
import { ProductFormGroup } from '../product-form';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [DestroyService],
})
export class EditComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private route: ActivatedRoute,
    private service: ProductsService,
    private dialog: ConfirmationDialogService,
    private destroy$: DestroyService,
  ) { }

  readonly categories$ = this.service.categories$;

  productForm = new ProductFormGroup(this.priceAddFn);

  private _emit = false;
  private _saves = 0;

  ngOnInit(): void {
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
      takeUntil(this.destroy$),
    ).subscribe();

    this.productForm.valueChanges.pipe(
      filter(_ => this._emit && this.productForm.valid),
      debounceTime(500),
      tap(_ => this._saves++),
      concatMap((prod: Product) => this.service.updateProduct(prod._id, prod)),
      tap(_ => --this._saves || this.productForm.markAsPristine()),
      takeUntil(this.destroy$),
    ).subscribe();
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
