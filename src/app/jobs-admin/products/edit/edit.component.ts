import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Product } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ProductsService } from 'src/app/services';
import { ProductFormComponent } from '../product-form/product-form.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, CanComponentDeactivate, OnDestroy {
  @ViewChild(ProductFormComponent) private _form: ProductFormComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: ConfirmationDialogService,
    private productService: ProductsService,
  ) { }

  private readonly _productUpdate$ = new Subject<Partial<Product>>();

  product$: Observable<Partial<Product>> = merge(
    this.route.data.pipe(map(data => data.product as Partial<Product>)),
    this._productUpdate$
  );

  ngOnInit(): void {
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
      this.productService.insertProduct(prod)
        .subscribe(res => {
          this._form.pristine = true;
          this.router.navigate(['../', res], { relativeTo: this.route });
        });
    }
  }

  ngOnDestroy() {
    this._productUpdate$.complete();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this._form.pristine ? true : this.dialog.discardChanges();
  }

}
