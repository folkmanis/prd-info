import { Directive, ChangeDetectorRef, Input } from '@angular/core';
import { KastesJob, Veikals, VeikalsBox, COLORS, Colors, ColorTotals } from 'src/app/interfaces';
import { VeikalsValidationErrors } from '../services/veikals-validation-errors';

@Directive({
  selector: '[appActiveVeikals]',
  exportAs: 'appActiveVeikals',
})
export class ActiveVeikalsDirective {
  @Input('appActiveVeikals') set edited(edited: Veikals | undefined) {
    this._edited = edited;
    this.reset();
  }
  get edited(): Veikals | undefined { return this._edited; }
  private _edited: Veikals | undefined;

  validationErrors: VeikalsValidationErrors | null;

  veikalsUpdate: Veikals | undefined;

  constructor() { }

  private reset(): void {
    this.validationErrors = null;
    this.veikalsUpdate = undefined;
  }

}
