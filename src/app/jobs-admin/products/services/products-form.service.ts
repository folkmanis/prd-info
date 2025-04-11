import { inject, Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassTransformer } from 'class-transformer';
import { isEqual, pickBy } from 'lodash-es';
import { map } from 'rxjs';
import { NewProduct, Product, ProductPrice, ProductProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';

@Injectable()
export class ProductsFormService {
  private productService = inject(ProductsService);
  private transformer = inject(ClassTransformer);

  initialValue: Product | null = null;

  form = this.createForm();

  updateChanges = this.form.valueChanges.pipe(map(() => this.changes));

  get isNew(): boolean {
    return !this.initialValue?._id;
  }

  get value() {
    return this.transformer.plainToInstance(Product, this.form.value, { exposeDefaultValues: true });
  }

  get changes(): Partial<Product> | null {
    if (this.isNew) {
      return pickBy(this.value, (value) => value !== null);
    } else {
      const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue?.[key]));
      return Object.keys(diff).length ? diff : null;
    }
  }

  setInitial(value: Product | null) {
    if (value?._id) {
      this.initialValue = value;
    } else {
      this.initialValue = new Product();
    }
    this.form.reset(this.initialValue);
    this.form.markAsPristine();
  }

  async save(): Promise<Product> {
    if (this.isNew) {
      const newProduct = pickBy(this.value, (value) => value !== null) as NewProduct;
      const inserted = await this.productService.insertProduct(newProduct);
      this.form.markAsPristine();
      return inserted;
    } else {
      const update = { ...this.changes, _id: this.value._id };
      const updated = await this.productService.updateProduct(update);
      this.setInitial(updated);
      return updated;
    }
  }

  canDeactivate(): boolean {
    return !this.changes || this.form.pristine;
  }

  reset(): void {
    this.form.reset(this.initialValue ?? undefined);
  }

  private createForm() {
    return new FormGroup({
      _id: new FormControl<string>(''),
      inactive: new FormControl(false, { nonNullable: true }),
      category: new FormControl<string>('', [Validators.required]),
      name: new FormControl<string>('', {
        validators: [Validators.required],
        asyncValidators: [this.nameAsyncValidator()],
      }),
      description: new FormControl<string>(''),
      units: new FormControl<string>('', [Validators.required]),
      prices: new FormControl<ProductPrice[]>([], { nonNullable: true }),
      paytraqId: new FormControl<number | null>(null),
      productionStages: new FormControl<ProductProductionStage[]>([], { nonNullable: true }),
    });
  }

  private nameAsyncValidator(): AsyncValidatorFn {
    return async (control) => {
      if (control.value === this.initialValue?.name) {
        return null;
      } else {
        const valid = await this.productService.validate('name', control.value.trim());
        return valid ? null : { occupied: control.value };
      }
    };
  }
}
