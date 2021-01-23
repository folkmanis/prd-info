import { Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormGroup } from '@rxweb/types';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class PreferencesCardControl<T> {

abstract stateChanges: Observable<void>;

abstract controls: IFormGroup<Partial<T>>;

abstract value: Partial<T>;

}
