import { Injectable } from '@angular/core';
import { FormBuilder, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup, IFormArray } from '@rxweb/types';
import { Product, ProductPrice } from 'src/app/interfaces';

@Injectable()
export class ProductFormService {

  private fb: IFormBuilder;

  constructor(
    fb: FormBuilder,
  ) { this.fb = fb; }

  createForm(): IFormGroup<Product> {
    const productForm: IFormGroup<Product> = this.fb.group<Product>({
      _id: [
        undefined,
        {
          validators: Validators.required
        }
      ],
      inactive: [false],
      category: [undefined],
      name: [
        undefined,
        {
          validators: Validators.required,
        }
      ],
      description: [undefined],
      prices: this.fb.array(
        [],
        { validators: [duplicateCustomersValidator] }
      ),
    });

    return productForm;
  }

  setValue(form: IFormGroup<Product>, product: Product, params = { emitEvent: true }) {
    const { prices, ...rest } = product;
    this.setPrices(form.controls.prices as IFormArray<ProductPrice>, prices);
    form.patchValue(rest, params);
    form.markAsPristine();
  }

  addPrice(pricesControl: IFormArray<ProductPrice>, price?: ProductPrice) {
    pricesControl.push(this.productPriceGroup(price));
    pricesControl.markAsDirty();
  }

  removePrice(pricesControl: IFormArray<ProductPrice>, idx: number) {
    pricesControl.removeAt(idx);
    pricesControl.markAsDirty();
  }

  setPrices(pricesArray: IFormArray<ProductPrice>, prodPrices: ProductPrice[]) {
    pricesArray.clear();
    for (const prodPrice of prodPrices) {
      pricesArray.push(
        this.productPriceGroup(prodPrice)
      );
    }
  }

  private productPriceGroup(price: ProductPrice): IFormGroup<ProductPrice> {
    console.log(price);
    return this.fb.group<ProductPrice>({
      customerName: [
        price?.customerName,
        [Validators.required],
      ],
      price: [
        price?.price,
        [Validators.required, Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)]
      ],
    });
  }

}

function duplicateCustomersValidator(ctrl: IFormArray<ProductPrice>): ValidationErrors | null {
  const customers: string[] = (ctrl.value as ProductPrice[]).map(pr => pr.customerName);
  const duplicates: string[] = customers.filter((val, idx, self) => self.indexOf(val) !== idx);
  return duplicates.length === 0 ? null : { duplicates: duplicates.join() };
}

