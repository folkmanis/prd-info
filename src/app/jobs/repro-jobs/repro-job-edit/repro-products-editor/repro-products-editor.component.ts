import {
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChildren,
  booleanAttribute,
  input,
  viewChildren,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerProduct } from 'src/app/interfaces';
import { JobProduct } from 'src/app/jobs';
import { KeyPressDirective } from '../key-press.directive';
import { JobProductForm } from './repro-product/job-product-form.interface';
import { ReproProductComponent } from './repro-product/repro-product.component';

const DEFAULT_PRODUCT: JobProduct = {
  name: null,
  price: null,
  units: null,
  count: null,
  comment: null,
};

@Component({
  selector: 'app-repro-products-editor',
  templateUrl: './repro-products-editor.component.html',
  styleUrls: ['./repro-products-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReproProductsEditorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ReproProductsEditorComponent,
    },
  ],
  standalone: true,
  imports: [
    MatCardModule,
    ReproProductComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    KeyPressDirective,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class ReproProductsEditorComponent
  implements ControlValueAccessor, Validator {

  productComponents = viewChildren(ReproProductComponent);

  customerProducts = input.required<CustomerProduct[]>();

  showPrices = input(false, { transform: booleanAttribute });

  productsControl = new FormArray<FormControl<JobProduct>>([]);

  onTouched: () => void = () => { };

  writeValue(obj: JobProduct[] | null): void {
    this.productsControl.clear({ emitEvent: false });
    if (Array.isArray(obj)) {
      obj.forEach((prod) => this.productsControl.push(new FormControl(prod)), {
        emitEvent: false,
      });
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
    if (this.productsControl.valid) {
      return null;
    };

    const errors = this.productsControl.controls.reduce(
      (errors, control, idx) => ({ ...errors, [idx]: control.errors }),
      {}
    );
    return errors;
  }

  focusLatest() {
    this.productComponents().slice(-1)[0]?.focus(); // last element
  }

  onRemoveProduct(idx: number) {
    this.productsControl.removeAt(idx);
  }

  onAddProduct() {
    this.productsControl.push(new FormControl(DEFAULT_PRODUCT));
    setTimeout(() => this.focusLatest(), 0);
  }

}
