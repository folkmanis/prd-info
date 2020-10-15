import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Product, ProductPrice } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { ProductsService } from 'src/app/services';
import { ProductFormService } from '../services/product-form.service';
import { ProductFormComponent } from '../product-form/product-form.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(ProductFormComponent) private _form: ProductFormComponent;
  constructor(
    private route: ActivatedRoute,
    private dialog: ConfirmationDialogService,
    private productService: ProductsService,
  ) { }


  product$: Observable<Product> = this.route.data.pipe(
    map(data => data.product as Product),
  );

  ngOnInit(): void {
  }

  onSave(prod: Product) {
    this.productService.updateProduct(prod._id, prod)
      .subscribe(res => this._form.pristine = res);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this._form.pristine ? true : this.dialog.discardChanges();
  }

}
