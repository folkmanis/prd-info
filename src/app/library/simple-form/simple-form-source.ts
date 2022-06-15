import { UntypedFormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { isEqual, pickBy } from 'lodash';

export abstract class SimpleFormSource<T extends Object> {

    initialValue: Partial<T> | undefined;

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

    get changes(): Partial<T> | undefined {
        const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
        return Object.keys(diff).length ? diff : undefined;
    }

    constructor(
        fb: UntypedFormBuilder
    ) {
        this.fb = fb;
    }

    abstract readonly isNew: boolean;
    protected abstract createForm(): IFormGroup<T>;
    abstract updateEntity(): Observable<T>;
    abstract createEntity(): Observable<string | number>;

    initValue(value: Partial<T>, params?: { emitEvent: boolean; }): void {
        this.initialValue = { ...value }; // ...this.initialValue,
        this.form.reset(undefined, params);
        this.form.patchValue(value, params);
        this.form.markAsPristine();
    }

    resetForm(value: T) {
        this.initValue(value, { emitEvent: false });
    }


}
