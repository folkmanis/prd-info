import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, Subject, ReplaySubject, merge, combineLatest } from 'rxjs';
import { tap, map, switchMap, takeUntil, filter, shareReplay, share, take } from 'rxjs/operators';
import { Product, CustomerProduct, JobProduct } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';

interface ProductFormValues {
  name: string;
  price: number | null;
  count: number;
  comment: string | null;
}

const COLUMNS = ['name', 'count', 'price', 'total', 'comment'];

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.css']
})
export class ProductsEditorComponent implements OnInit, OnDestroy, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('productsFormArray') private _productsForm: FormArray;
  @Input() products: JobProduct[];
  @Input() customer: string;

  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder,
  ) { }

  displayedColumns: string[] = COLUMNS;

  get isEnabled(): boolean { return !this._productsForm.disabled; }

  customer$: ReplaySubject<string> = new ReplaySubject(1);
  products$: Observable<CustomerProduct[]> = this.customer$.pipe(
    filter(customer => customer && customer.length > 0),
    switchMap(customer => this.productsService.productsCustomer(customer)),
    shareReplay(1),
  );

  addProduct$: Subject<void> = new Subject();
  removeProduct$: Subject<number> = new Subject();
  private readonly productsForm$: ReplaySubject<FormArray> = new ReplaySubject(1);

  unsub: Subject<void> = new Subject();

  productsData$: Observable<FormGroup[]> = merge(
    this.addProduct$.pipe(
      map(() => this.addNewProduct()),
    ),
    this.removeProduct$.pipe(
      map(idx => this.removeProduct(idx)),
    ),
    this.productsForm$
  )
    .pipe(
      map(formArr => (formArr.controls as FormGroup[])),
    );

  ngOnInit(): void {
    this.displayedColumns = this.isEnabled ? COLUMNS.concat(['buttons']) : COLUMNS;
    this._productsForm?.valueChanges.pipe(
      switchMap(this.defaultProductPrice(this._productsForm, this.products$)),
      takeUntil(this.unsub),
    )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      const products: JobProduct[] = changes.products.currentValue;
      this.setProductForm(products);
      this.productsForm$.next(this._productsForm);
    }
    if (changes.customer) {
      const customer: string = changes.customer.currentValue;
      this.customer$.next(customer);
    }
  }

  ngOnDestroy(): void {
    this.unsub.next();
  }


  private addNewProduct(): FormArray {
    this._productsForm.push(this.addProductToFormGroup());
    return this._productsForm;
  }

  private removeProduct(idx: number): FormArray {
    this._productsForm.removeAt(idx);
    this._productsForm.markAsDirty();
    return this._productsForm;
  }

  private setProductForm(products: JobProduct[] | null): FormArray {
    this._productsForm.clear();
    for (const product of products || []) {
      this._productsForm.push(this.addProductToFormGroup(product));
    }
    return this._productsForm;
  }

  private addProductToFormGroup(product?: Partial<JobProduct>): FormGroup {
    const _group = this.fb.group({
      name: [
        product?.name,
        {
          validators: [Validators.required],
          asyncValidators: [this.productAsyncValidatorFn(this.products$)],
        }
      ],
      price: [
        product?.price,
        {
          validators: [Validators.min(0)],
        }
      ],
      count: [
        product?.count || 0,
        {
          validators: [Validators.min(0)],
        }
      ],
      comment: [product?.comment],
    });
    this.isEnabled ? _group.enable() : _group.disable();
    return _group;
  }

  private productAsyncValidatorFn(prod$: Observable<CustomerProduct[]>): AsyncValidatorFn {
    return (control: AbstractControl): null | Observable<ValidationErrors | null> =>
      prod$.pipe(
        map(products => products.some(product => product.productName === control.value) ? null : { invalidProduct: 'Prece nav atrasta katalogā' }),
        take(1),
      );
  }

  private defaultProductPrice(
    frm: FormArray,
    prod$: Observable<CustomerProduct[]>
  ): (values: ProductFormValues[]) => Observable<ProductFormValues[]> {

    let prevValues: ProductFormValues[] | undefined;
    return (values: ProductFormValues[]) => {
      return prod$.pipe(
        tap(products => {
          values.forEach((val, idx) => {
            // Ja nav pareizs preces nosaukums
            if (!frm.at(idx).get('name')?.valid) {
              return;
            }
            // Cenas nav vispār VAI mainās preces nosaukums
            if (val.price === null || !(prevValues && prevValues.length === values.length && val.name === prevValues[idx].name)) {
              frm.at(idx).get('price').setValue(products.find(product => product.productName === val.name)?.price, { emitEvent: false });
            }
          });

        }),
        tap(() => prevValues = values),
        map(() => values)
      );
    };
  }
}
