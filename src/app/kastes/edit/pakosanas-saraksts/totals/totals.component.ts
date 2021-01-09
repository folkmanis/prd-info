import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ColorTotals } from 'src/app/interfaces';
import { KastesPreferencesService } from 'src/app/kastes/services/kastes-preferences.service';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent {
  @Input() get totals(): ColorTotals[] {
    return this._totals;
  }
  set totals(totals: ColorTotals[]) {
    this._totals = totals || [];
    this.veikalsTotal = this.totals.reduce((acc, curr) => acc + curr.total, 0);
  }
  private _totals: ColorTotals[] = [];

  @Input() newTotals: ColorTotals[] | undefined;

  constructor(
    private prefsServices: KastesPreferencesService,
  ) { }

  veikalsTotal = 0;

  colors$ = this.prefsServices.preferences$.pipe(
    map(pref => pref.colors),
  );


}
