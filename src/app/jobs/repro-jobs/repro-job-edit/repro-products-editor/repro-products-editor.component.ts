import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DestroyService } from 'prd-cdk';
import { CustomerProduct } from 'src/app/interfaces';
import { JobProduct } from 'src/app/jobs';
import { KeyPressDirective } from '../key-press.directive';
import { JobProductForm } from './repro-product/job-product-form.interface';
import { ProductControlDirective } from './repro-product/product-control.directive';
import { ReproProductComponent } from './repro-product/repro-product.component';


const DEFAULT_PRODUCT: JobProduct = {
  name: '',
  price: 0,
  units: 'gab.',
  count: 0,
  comment: null,
};


@Component({
  selector: 'app-repro-products-editor',
  templateUrl: './repro-products-editor.component.html',
  styleUrls: ['./repro-products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReproProductsEditorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ReproProductsEditorComponent,
    }
  ],
  standalone: true,
  imports: [
    MatCardModule,
    NgFor,
    ReproProductComponent,
    ProductControlDirective,
    FormsModule,
    ReactiveFormsModule, MatButtonModule,
    KeyPressDirective, MatTooltipModule, MatIconModule
  ]
})
export class ReproProductsEditorComponent implements ControlValueAccessor, Validator {

  @ViewChildren(ReproProductComponent)
  productComponents: QueryList<ReproProductComponent>;

  @Input()
  customerProducts: CustomerProduct[] = [];

  @Input()
  showPrices: boolean;

  productsControl = new FormArray<JobProductForm>([]);

  onTouched: () => void = () => { };

  writeValue(obj: JobProduct[] | null): void {
    this.productsControl.clear({ emitEvent: false });
    if (Array.isArray(obj)) {
      obj.forEach(prod => this.productsControl.push(this.createForm(prod)), { emitEvent: false });
    }
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.productsControl.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.productsControl.disable();
    } else {
      this.productsControl.enable();
    }
  }

  validate(): ValidationErrors {

    if (this.productsControl.valid) return null;

    return this.productsControl.controls
      .reduce((acc, curr, idx) => ({ ...acc, [idx]: curr.errors }), {});

  }

  focusLatest() {
    this.productComponents.last.focus();
  }

  onRemoveProduct(idx: number) {
    this.productsControl.removeAt(idx);
  }

  onAddProduct() {
    this.productsControl.push(this.createForm(DEFAULT_PRODUCT));
    setTimeout(() => this.focusLatest(), 0);
  }


  private createForm(product: JobProduct): JobProductForm {
    return new FormGroup({
      name: new FormControl(
        product.name,
        [this.productNameValidatorFn()]
      ),
      price: new FormControl<number>(
        product.price,
        [Validators.required, Validators.min(0)],
      ),
      count: new FormControl<number>(
        product.count,
        [Validators.required, Validators.min(0)],
      ),
      units: new FormControl(
        product.units,
        Validators.required,
      ),
      comment: new FormControl(product.comment),
    });
  }

  private productNameValidatorFn(): ValidatorFn {
    const err = { invalidProduct: 'Prece nav atrasta katalogā' };
    return (control: AbstractControl<string>) => {
      return this.customerProducts.some(prod => prod.productName === control.value) ? null : err;
    };

  };

}
