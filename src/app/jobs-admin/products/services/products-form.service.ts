import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { isEqual, pickBy } from 'lodash-es';
import { tap, map, Observable, of } from 'rxjs';
import { JobProductionStage, Product, NewProduct, ProductPrice } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { ClassTransformer } from 'class-transformer';


@Injectable()
export class ProductsFormService {

  initialValue: Product | null = null;

  form = this.createForm();

  updateChanges = this.form.valueChanges.pipe(
    map(() => this.changes),
  );

  get isNew(): boolean {
    return !this.initialValue?._id;
  }

  get value() {
    return this.transformer.plainToInstance(Product, this.form.value, { exposeDefaultValues: true });
  }

  get changes(): Partial<Product> | undefined {
    if (this.isNew) {
      return pickBy(this.value, value => value !== null);
    } else {
      const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
      return Object.keys(diff).length ? diff : undefined;
    }
  }

  constructor(
    private productService: ProductsService,
    private transformer: ClassTransformer,
  ) { }

  setInitial(value: Product | null) {
    if (value._id) {
      this.initialValue = value;
    } else {
      this.initialValue = new Product();
    }
    this.form.reset(this.initialValue);
    this.form.markAsPristine();
  }

  save(): Observable<Product> {
    if (this.isNew) {
      const product = pickBy(this.value, value => value !== null) as NewProduct;
      return this.productService.insertProduct(product).pipe(
        tap(() => this.form.markAsPristine()),
      );
    } else {
      const update = { ...this.changes, _id: this.value._id };
      return this.productService.updateProduct(update).pipe(
        tap(value => this.setInitial(value)),
        tap((value) => this.setInitial(value)),
      );
    }
  }

  canDeactivate(): boolean {
    return !this.changes || this.form.pristine;
  }

  reset(): void {
    this.form.reset(this.initialValue);
  }

  private createForm() {
    return new FormGroup({
      _id: new FormControl<string>(''),
      inactive: new FormControl(false, { nonNullable: true }),
      category: new FormControl<string>(
        undefined,
        [Validators.required]
      ),
      name: new FormControl<string>(
        undefined,
        {
          validators: [Validators.required],
          asyncValidators: [this.nameAsyncValidator()]
        }
      ),
      description: new FormControl<string>(''),
      units: new FormControl<string>(
        undefined,
        [Validators.required],
      ),
      prices: new FormControl<ProductPrice[]>([], { nonNullable: true }),
      paytraqId: new FormControl<number>(null),
      productionStages: new FormControl<JobProductionStage[]>([], { nonNullable: true }),
    });

  }

  private nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      if (control.value === this.initialValue?.name) {
        return of(null);
      } else {
        return this.productService.validate('name', control.value.trim()).pipe(
          map(valid => valid ? null : { occupied: control.value })
        );
      }
    };
  }


}
