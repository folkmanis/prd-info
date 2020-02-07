import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { filter, switchMap } from 'rxjs/operators';
import { ModulePreferencesService, ModulePreferences, KastesPreferences } from '../../services/module-preferences.service';
import { LoginService } from 'src/app/login/login.service';

interface Color {
  hue: number,
  saturation: number,
  lightness: number,
}

interface Colors {
  yellow: Color,
  rose: Color,
  white: Color,
}

@Component({
  selector: 'app-kastes-preferences',
  templateUrl: './kastes-preferences.component.html',
  styleUrls: ['./kastes-preferences.component.css']
})
export class KastesPreferencesComponent implements OnInit {

  private hslRegex = /hsl\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%\)/;
  constructor(
    private moduleService: ModulePreferencesService,
    private fb: FormBuilder,
    private loginService: LoginService,
  ) { }

  preferences: KastesPreferences;
  colors: Colors;
  keys: string[] = [];
  colorsForm: FormGroup;// = new FormGroup({});

  ngOnInit() {
    this.moduleService.getModulePreferences('kastes').subscribe(
      (pref: KastesPreferences) => {
        const controlGroup: { [key: string]: any; } = {};
        this.colors = this.parseColors(pref);
        this.keys = Object.keys(this.colors);
        this.preferences = pref;
        for (const key of this.keys) {
          controlGroup[key] = [this.colors[key].lightness];
        }
        this.colorsForm = this.fb.group(controlGroup);
      }
    );
  }

  onSave() {
    this.updateColors();
    this.moduleService.updateModulePreferences(this.preferences).pipe(
      filter(resp => resp),
      switchMap(() => this.loginService.reloadPreferences())
    )
      .subscribe(() => {
        this.colorsForm.markAsPristine();
      });
  }

  private parseColors(pref: KastesPreferences): Colors {
    const colors = pref.settings.colors;
    const parsed: Partial<Colors> = {};
    for (const key in colors) {
      if (colors.hasOwnProperty(key)) {
        parsed[key] = colors[key].match(this.hslRegex).groups as Color;
        // this.colorsForm.get(key).setValue(+parsed[key].lightness);
      }
    }
    return parsed as Colors;
  }

  private updateColors() {
    for (const key in this.colorsForm.value) {
      if (this.colorsForm.value.hasOwnProperty(key)) {
        this.colors[key].lightness = +this.colorsForm.value[key];
        this.preferences.settings.colors[key] = this.makeColor(this.colors[key]);
      }
    }
  }

  private makeColor(col: Color): string {
    return `hsl(${col.hue},${col.saturation}%,${col.lightness}%)`;
  }

}
