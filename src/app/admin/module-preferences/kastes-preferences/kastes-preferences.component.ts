import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { ModulePreferencesService, ModulePreferences, KastesPreferences } from '../../services/module-preferences.service';
import { LoginService } from 'src/app/login/login.service';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { Observable } from 'rxjs';

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
export class KastesPreferencesComponent implements OnInit, CanComponentDeactivate {

  private hslRegex = /hsl\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%\)/;
  constructor(
    private moduleService: ModulePreferencesService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private dialogService: ConfirmationDialogService,
  ) { }

  preferences: KastesPreferences;
  colors: Colors;
  keys: string[] = [];
  colorsForm: FormGroup;
  defaults: { [key: string]: number; } = {};

  ngOnInit() {
    this.moduleService.getModulePreferences('kastes').subscribe(
      (pref: KastesPreferences) => {
        this.colors = this.parseColors(pref);
        this.keys = Object.keys(this.colors);
        this.preferences = pref;
        this.colorsForm = this.fb.group(this.lightness());
        this.colorsForm.valueChanges.pipe(
          tap(val => this.updateColors(val))
        ).subscribe();
      }
    );
  }

  private lightness(): { [key: string]: number[]; } {
    const light: { [key: string]: number[]; } = {};
    for (const key of this.keys) {
      const l = +this.colors[key].lightness;
      light[key] = [l];
      this.defaults[key] = l;
    }
    return light;
  }

  onSave() {
    this.moduleService.updateModulePreferences(this.preferences).pipe(
      filter(resp => resp),
      switchMap(() => this.loginService.reloadPreferences()),
      tap(() => this.colorsForm.markAsPristine()),
    )
      .subscribe();
  }

  onReset() {
    this.colorsForm.reset(this.defaults);
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.colorsForm.pristine || this.dialogService.discardChanges();
  }

  private parseColors(pref: KastesPreferences): Colors {
    const colors = pref.settings.colors;
    const parsed: Partial<Colors> = {};
    for (const key in colors) {
      if (colors.hasOwnProperty(key)) {
        parsed[key] = colors[key].match(this.hslRegex).groups as Color;
      }
    }
    return parsed as Colors;
  }

  private updateColors(values: { [key: string]: number; }) {
    for (const key in values) {
      if (this.colorsForm.value.hasOwnProperty(key)) {
        this.colors[key].lightness = values[key];
        this.preferences.settings.colors[key] = this.makeColor(this.colors[key]);
      }
    }
  }

  private makeColor(col: Color): string {
    return `hsl(${col.hue},${col.saturation}%,${col.lightness}%)`;
  }

}
