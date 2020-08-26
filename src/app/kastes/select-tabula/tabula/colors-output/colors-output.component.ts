import { Component, Input, OnInit } from '@angular/core';
import { Totals, Colors } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../../services/kastes-preferences.service';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-colors-output',
  templateUrl: './colors-output.component.html',
  styleUrls: ['./colors-output.component.css']
})
export class ColorsOutputComponent implements OnInit {
  @Input('colorsRemain') set totals(_tot: Totals) {
    this.totalsColors = _tot?.colorTotals || [];
  }

  totalsColors: {
    color: Colors;
    total: number;
  }[];

  constructor(
    private pref: KastesPreferencesService,
  ) { }

  colors$ = this.pref.preferences$.pipe(
    pluck('colors'),
  );

  ngOnInit() {
  }

}
