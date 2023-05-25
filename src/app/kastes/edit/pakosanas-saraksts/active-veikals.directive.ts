import { Directive, Input } from '@angular/core';
import { Veikals } from 'src/app/kastes/interfaces';
import { VeikalsValidationErrors } from '../services/veikals-validation-errors';

@Directive({
  selector: '[appActiveVeikals]',
  exportAs: 'appActiveVeikals',
  standalone: true,
})
export class ActiveVeikalsDirective {

  private _edited: Veikals | null = null;
  @Input('appActiveVeikals')
  set edited(edited: Veikals | null) {
    this._edited = edited;
    this.reset();
  }
  get edited() {
    return this._edited;
  }

  validationErrors: VeikalsValidationErrors | null;

  veikalsUpdate: Veikals | null;

  private reset(): void {
    this.validationErrors = null;
    this.veikalsUpdate = null;
  }

}
