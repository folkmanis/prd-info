import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorTotals, Veikals } from 'src/app/kastes/interfaces';
import { getKastesPreferences } from 'src/app/kastes/services/kastes-preferences.service';
import { colorTotalsFromVeikalsBoxs } from '../../../common';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';
import { CommonModule } from '@angular/common';
import { PlusSignPipe } from '../../services/plus-sign.pipe';

@Component({
  selector: 'app-totals',
  standalone: true,
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PlusSignPipe,
  ]
})
export class TotalsComponent {

  colors$ = getKastesPreferences('colors');

  veikalsTotal = 0;

  @Input() get veikals(): Veikals {
    return this._veikals;
  }
  set veikals(veikals: Veikals) {
    this._veikals = veikals;
    this.totals = colorTotalsFromVeikalsBoxs(veikals.kastes);
    this.veikalsTotal = this.totals.reduce((acc, curr) => acc + curr.total, 0);
  }
  private _veikals: Veikals;

  totals: ColorTotals[] = [];

  @Input() set errors(errors: VeikalsValidationErrors | null) {
    this._errors = errors;
  }
  get errors(): VeikalsValidationErrors | null {
    return this._errors;
  }
  private _errors: VeikalsValidationErrors | null;


}
