import { Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormGroup } from '@rxweb/types';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PreferencesCardControl<T> {

abstract stateChanges: Observable<void>;

abstract controls: IFormGroup<Partial<T>>;

abstract value: Partial<T>;

}
