import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { COLORS, Colors, ColorTotals, Veikals } from 'src/app/interfaces';
import { KastesPreferencesService } from 'src/app/kastes/services/kastes-preferences.service';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent {

  @Input() get veikals(): Veikals {
    return this._veikals;
  }
  set veikals(veikals: Veikals) {
    this._veikals = veikals;
    this.totals = this.veikalsTotals(this.veikals);
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

  constructor(
    private prefsServices: KastesPreferencesService,
  ) { }

  veikalsTotal = 0;

  colors$ = this.prefsServices.preferences$.pipe(
    map(pref => pref.colors),
  );

  private veikalsTotals(veik: Veikals): ColorTotals[] {
    const tot = new Map<Colors, number>(COLORS.map(col => [col, 0]));
    for (const k of veik.kastes) {
      COLORS.forEach(c => tot.set(c, tot.get(c) + k[c]));
    }
    return [...tot.entries()].map(([color, total]) => ({ color, total }));
  }


}
