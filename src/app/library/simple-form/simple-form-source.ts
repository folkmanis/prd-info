import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';

export abstract class SimpleFormSource<T> {
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

    abstract readonly isNew: boolean;
    protected abstract createForm(): IFormGroup<T>;
    abstract updateFn(value: T): Observable<T>;
    abstract insertFn(value: T): Observable<string | number>;

    initValue(value: Partial<T>, params?: { emitEvent: boolean; }): void {
        this.form.reset(undefined, params);
        this.form.patchValue(value, params);
        this.form.markAsPristine();
    }

    resetForm(value: T) {
        this.initValue(value, { emitEvent: false });
    }


}
