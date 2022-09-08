import { Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export type FormGroupType<T> = {
    [key in keyof T]: FormControl<T[key]>
};

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PreferencesCardControl<T> {

    abstract stateChanges: Observable<void>;

    abstract controls: FormGroup<FormGroupType<T>>;

    abstract value: Partial<T>;

}
