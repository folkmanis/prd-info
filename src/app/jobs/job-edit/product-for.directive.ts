import { Directive, Input, ViewContainerRef, TemplateRef, DoCheck } from '@angular/core';
import { FormGroup, FormArray, Validators, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { CustomerProduct } from 'src/app/interfaces';

interface ProductFormValues {
  name: string;
  price: number | null;
  count: number;
  comment: string | null;
}

export class AppProductForContext {
  constructor(
    public $implicit: FormGroup,
    public index: number,
    public count: number,
  ) { }
}

@Directive({
  selector: '[appProductForOf]'
})
export class ProductForOfDirective implements DoCheck {
  @Input() set appProductForOf(_frmArr: FormArray) {
    if (_frmArr) {
      this._formArray = _frmArr;
    }
  }

  @Input() set appProductForCustomerProducts(_prod: CustomerProduct[]) {
    if (_prod) {
      console.log(_prod);
      this._customerProducts = _prod;
      this._setValidators();
    }
  }

  private _formArray: FormArray;
  private _customerProducts: CustomerProduct[];
  private count = 0;
  private customer: string;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _template: TemplateRef<AppProductForContext>,
  ) { }

  ngDoCheck(): void {
    if (this._formArray.controls.length !== this.count) {
      console.log('do check');
      this.count = this._formArray.controls.length;
      this._applyChanges();
      this._setValidators();
    }
  }

  private _applyChanges() {
    const form = this._formArray.controls as FormGroup[];
    this._viewContainer.clear();
    for (let i = 0; i < form.length; i++) {
      const view = this._viewContainer.createEmbeddedView(
        this._template,
        new AppProductForContext(
          form[i], i, form.length
        )
      );
    }
  }

  private _setValidators() {
    for (const gr of this._formArray.controls) {
      const nameCtr = gr.get('name');
      nameCtr.setValidators([Validators.required, this.productValidatorFn(this._customerProducts)]);
      gr.setValidators([this.defaultPriceValidatorFn(this._customerProducts)]);
    }
    this._formArray.updateValueAndValidity();
  }

  private defaultPriceValidatorFn(prod: CustomerProduct[]): ValidatorFn {
    let prevVal: ProductFormValues | undefined;
    return (control: FormGroup): null | ValidationErrors => {
      if (!control.get('name').valid) {
        return null;
      }
      console.log(control);
      const val = control.value as ProductFormValues;
      if (prevVal === undefined || prevVal.name !== val.name) {
        const prodPrice = prod?.find(product => product.productName === val.name)?.price;
        prevVal = { ...val, price: prodPrice };
        control.get('price').setValue(prodPrice, { emitEvent: false });
      }
      return null;
    };
  }

  private productValidatorFn(prod: CustomerProduct[]): ValidatorFn {
    return (control: FormControl): null | ValidationErrors =>
      prod.some(product => product.productName === control.value) ? null : { invalidProduct: 'Prece nav atrasta katalogā' };
  }



}
