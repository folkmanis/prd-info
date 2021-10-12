import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Colors, ColorTotals } from 'src/app/kastes/interfaces';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-color-totals',
  templateUrl: './color-totals.component.html',
  styleUrls: ['./color-totals.component.scss']
})
export class ColorTotalsComponent implements OnInit {
  @Input() colorTotals: ColorTotals[] = [];

  constructor(
    private preferences: KastesPreferencesService,
  ) { }

  colors$ = this.preferences.preferences$.pipe(
    map(pref => pref.colors),
  );

  ngOnInit(): void {
  }

}
