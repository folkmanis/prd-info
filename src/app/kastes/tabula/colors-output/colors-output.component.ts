import { Component, Input, OnInit } from '@angular/core';

import { ColorsPakas } from '../tabula-datasource';
import { KastesPreferences } from '../../services/preferences';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

interface ColorItem {
  name: string,
  val: number,
  style: { color: string; },
}

@Component({
  selector: 'app-colors-output',
  templateUrl: './colors-output.component.html',
  styleUrls: ['./colors-output.component.css']
})
export class ColorsOutputComponent implements OnInit {

  @Input('colorsRemain') colorsRemain: Observable<ColorsPakas>;
  preferences: KastesPreferences;
  data: ColorItem[] = [];
  constructor(
    private kastesPreferencesService: KastesPreferencesService
  ) { }

  pakas: ColorsPakas;
  ngOnInit() {

    this.kastesPreferencesService.preferences
      .pipe(
        tap(pref => this.preferences = pref),
        switchMap(() => this.colorsRemain),
      )
      .subscribe(col => {
        const newData: ColorItem[] = [];
        for (const key of Object.keys(col)) {
          newData.push({
            name: key,
            val: col[key],
            style: { color: this.preferences.colors[key] }
          });
        }
        this.data = newData;
      });
  }

}
