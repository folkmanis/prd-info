import { Injectable } from '@angular/core';
import { FormBuilder, ValidatorFn, ValidationErrors, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { IFormBuilder, IFormGroup, IFormArray, IFormControl } from '@rxweb/types';
import { Product, ProductPrice } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductFormService {

  private fb: IFormBuilder;
  private _form: IFormGroup<Product>;

  constructor(
    fb: FormBuilder,
    private productsService: ProductsService,
  ) { this.fb = fb; }

  get form(): IFormGroup<Product> {
    if (!this._form) {
      this._form = this.createForm();
    }
    return this._form;
  }

  private get formPrices(): IFormArray<ProductPrice> {
    return this.form.controls.prices as IFormArray<ProductPrice>;
  }

  private createForm(): IFormGroup<Product> {
    const productForm: IFormGroup<Product> = this.fb.group<Product>({
      _id: [undefined],
      inactive: [false],
      category: [
        undefined,
        [Validators.required]
      ],
      name: [
        undefined,
        {
          validators: Validators.required,
        }
      ],
      description: [undefined],
      prices: this.fb.array(
        [],
        { validators: [this.duplicateCustomersValidator] }
      ),
    });

    return productForm;
  }

  setValue(product: Partial<Product>, params = { emitEvent: true }) {
    const { prices, ...rest } = product;
    if (!rest._id) { this.setNameValidators(); }
    this.setPrices(prices);
    this.form.patchValue(rest, params);
    this.form.markAsPristine();
  }

  addPrice(price?: ProductPrice) {
    this.formPrices.push(this.productPriceGroup(price));
    this.formPrices.markAsDirty();
  }

  setNameValidators() {
    this.form.controls.name.setAsyncValidators(this.nameAsyncValidator('name'));
  }

  removePrice(idx: number) {
    this.formPrices.removeAt(idx);
    this.formPrices.markAsDirty();
  }

  setPrices(prodPrices: ProductPrice[] | undefined) {
    this.formPrices.clear();
    for (const prodPrice of prodPrices || []) {
      this.formPrices.push(
        this.productPriceGroup(prodPrice)
      );
    }
  }

  private productPriceGroup(price: ProductPrice): IFormGroup<ProductPrice> {
    return this.fb.group<ProductPrice>({
      customerName: [
        price?.customerName,
        [Validators.required],
      ],
      price: [
        price?.price,
        [
          Validators.required,
          Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)
        ]
      ],
    });
  }

  private nameAsyncValidator(key: keyof Product): AsyncValidatorFn {
    return (control: IFormControl<string>): Observable<ValidationErrors | null> => {
      return this.productsService.validate(key, control.value).pipe(
        map(valid => valid ? null : { occupied: control.value })
      );
    };
  }

  private duplicateCustomersValidator(ctrl: IFormArray<ProductPrice>): ValidationErrors | null {
    const customers: string[] = (ctrl.value as ProductPrice[]).map(pr => pr.customerName);
    const duplicates: string[] = customers.filter((val, idx, self) => self.indexOf(val) !== idx);
    return duplicates.length === 0 ? null : { duplicates: duplicates.join() };
  }

}
