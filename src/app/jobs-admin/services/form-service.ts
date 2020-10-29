import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

export abstract class FormService<T> {

  protected fb: IFormBuilder;

  get form(): IFormGroup<T> {
    if (!this._form) {
      this._form = this.createForm();
    }
    return this._form;
  }
  private _form: IFormGroup<T>;

  get value(): T {
    return this.form.value;
  }

  constructor(
    fb: FormBuilder
  ) {
    this.fb = fb;
  }

  protected abstract createForm(): IFormGroup<T>;

  initValue(product: Partial<T>, params?: { emitEvent: boolean; }): void {
    this.form.reset(undefined, params);
    this.form.patchValue(product, params);
    this.form.markAsPristine();
  }
}
