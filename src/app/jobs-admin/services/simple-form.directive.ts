import {
  ChangeDetectorRef, Directive,
  EventEmitter, Input, Output
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { FormService } from '../services/form-service';
/**
 * Pamatklase komponentei ar formu
 */

@Directive()
export class SimpleFormDirective<T> {

  /** Forma */
  get form() { return this.formService.form; }

  /** Sākuma vērtība */

  @Input()
  set value(value: Partial<T>) {
    if (!value) { return; }
    this.formService.setValue(value, { emitEvent: false });
    this._value = value;
  }
  get value(): Partial<T> { return this._value; }
  private _value: Partial<T>;

  /** Formas vērtība pēc apstiprināšanas */

  @Output() submitValue = new EventEmitter<T>();

  /** Formas vērtības izmaiņas, kas mainās dinamiski */

  @Output() valueChanges = this.form.valueChanges.pipe(
    filter(_ => this.form.valid));

  /** formas pristine statuss */
  get pristine(): boolean {
    return this.form.pristine;
  }
  set pristine(pristine: boolean) {
    pristine ? this.form.markAsPristine() : this.form.markAsDirty();
    this.changeDetection.markForCheck();
  }

  constructor(
    protected formService: FormService<T>,
    protected changeDetection: ChangeDetectorRef) { }

  /** Atjauno sākotnējo vērtību */
  onReset() {
    this.formService.setValue(this.value, { emitEvent: false });
  }

  /** Lietojams saglabāšanas pogai. Nosūta vērtību ietverošai komponentei */
  onSave() {
    if (!this.form.valid) { return; }
    this.submitValue.next(this.formService.value);
  }

}
