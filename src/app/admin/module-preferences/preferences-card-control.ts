import { Directive } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PreferencesCardControl<T> {

    abstract stateChanges: Observable<void>;

    abstract controls: UntypedFormGroup;

    abstract value: Partial<T>;

}
