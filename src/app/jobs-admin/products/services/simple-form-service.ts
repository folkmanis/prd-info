import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';

export abstract class SimpleFormService<T> {

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
  abstract updateFn(value: T): Observable<T>;
  abstract insertFn(value: T): Observable<string | number>;
  abstract isNew(): boolean;

  initValue(product: Partial<T>, params?: { emitEvent: boolean; }): void {
    this.form.reset(undefined, params);
    this.form.patchValue(product, params);
    this.form.markAsPristine();
  }

  resetForm(value: T) {
    this.initValue(value, { emitEvent: false });
  }

}
