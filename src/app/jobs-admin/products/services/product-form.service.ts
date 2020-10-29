import { Injectable } from '@angular/core';
import { FormBuilder, ValidatorFn, ValidationErrors, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { IFormGroup, IFormArray, IFormControl } from '@rxweb/types';
import { Product, ProductPrice } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { map } from 'rxjs/operators';
import { FormService } from '../../services/form-service';

@Injectable()
export class ProductFormService extends FormService<Product> {

  constructor(
    fb: FormBuilder,
    private productsService: ProductsService,
  ) {
    super(fb);
  }

  private get formPrices(): IFormArray<ProductPrice> {
    return this.form.controls.prices as IFormArray<ProductPrice>;
  }

  protected createForm(): IFormGroup<Product> {
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

  initValue(product: Partial<Product>, params = { emitEvent: true }) {
    const { prices, ...rest } = product;

    if (!rest._id) {
      this.setNameValidators();
    } else {
      this.removeNameValidators();
    }
    this.setPrices(prices);

    super.initValue(product, params);
  }

  get value(): Product {
    return {
      ...super.value,
      name: super.value.name.trim(),
    };
  }

  addPrice(price?: ProductPrice) {
    this.formPrices.push(this.productPriceGroup(price));
    this.formPrices.markAsDirty();
  }

  removePrice(idx: number) {
    this.formPrices.removeAt(idx);
    this.formPrices.markAsDirty();
  }

  private setNameValidators() {
    this.form.controls.name.setAsyncValidators(this.nameAsyncValidator('name'));
  }
  private removeNameValidators() {
    this.form.controls.name.clearAsyncValidators();
  }

  private setPrices(prodPrices: ProductPrice[] | undefined) {
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
      return this.productsService.validate(key, control.value.trim()).pipe(
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
