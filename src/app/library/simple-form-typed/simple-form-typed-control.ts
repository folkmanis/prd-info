import { Observable } from 'rxjs';
import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';


@Directive()
export abstract class SimpleFormTypedControl<T> {

    abstract readonly stateChanges: Observable<any>;

    abstract readonly isNew: boolean;

    abstract readonly changes: Partial<T>;

    abstract readonly value: T;

    abstract readonly form: AbstractControl;

    abstract onData(value: T): void;

    abstract onUpdate(): Observable<T>;

    abstract onCreate(): Observable<string | number>;

    abstract onReset(): void;

}
