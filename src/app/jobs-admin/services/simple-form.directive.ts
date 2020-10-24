import {  ChangeDetectorRef, Directive,  Input, Output} from '@angular/core';
import { filter } from 'rxjs/operators';
import { FormService } from '../services/form-service';
/**
 * Pamatklase komponentei ar formu
 */

@Directive()
export abstract class SimpleFormDirective<T> {

  /** Forma */
  get form() { return this.formService.form; }

  /** Sākuma vērtība */
  @Input()
  set value(value: Partial<T>) {
    if (!value) { return; }
    this.formService.patchValue(value, { emitEvent: false });
    this._value = value;
  }
  get value(): Partial<T> { return this._value; }
  private _value: Partial<T>;

  /** Formas vērtības izmaiņas, kas mainās dinamiski */

  @Output() valueChanges = this.form.valueChanges.pipe(
    filter(_ => this.form.valid));

  constructor(
    protected formService: FormService<T>,
  ) { }

  /** Lietojams saglabāšanas pogai. */
  abstract onSave(value: T): void;

  /** Atjauno sākotnējo vērtību */
  onReset() {
    this.formService.patchValue(this.value, { emitEvent: false });
  }

}
