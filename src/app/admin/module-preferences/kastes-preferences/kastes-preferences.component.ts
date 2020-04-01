import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { filter, switchMap, tap, map, takeUntil } from 'rxjs/operators';
import { ModulePreferencesService } from '../../services/module-preferences.service';
import { KastesSettings } from 'src/app/library/classes/system-preferences-class';
import { LoginService } from 'src/app/login/login.service';
import { Observable, of, Subject } from 'rxjs';
import { PreferencesComponent } from '../preferences-component.class';

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
  styleUrls: ['./kastes-preferences.component.css', '../module-preferences.component.css']
})
export class KastesPreferencesComponent implements OnInit, OnDestroy, PreferencesComponent {

  private hslRegex = /hsl\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%\)/;
  constructor(
    private moduleService: ModulePreferencesService,
    private fb: FormBuilder,
    private loginService: LoginService,
  ) { }

  preferences: KastesSettings;
  colors: Colors;
  keys: string[] = [];
  colorsForm: FormGroup;
  defaults: { [key: string]: number; } = {};
  unsub = new Subject<void>();

  ngOnInit() {
    this.moduleService.getModulePreferences('kastes').pipe(
      tap((pref: KastesSettings) => this.preferences = pref),
      tap((pref: KastesSettings) => this.colors = this.parseColors(pref)),
      tap(() => this.keys = Object.keys(this.colors)),
      tap(() => this.colorsForm = this.fb.group(this.lightness())),
      switchMap(() => this.colorsForm.valueChanges),
      tap(val => this.updateColors(val)),
      takeUntil(this.unsub),
    ).subscribe();
      
  }

  ngOnDestroy(): void {
    this.unsub.next();
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
    if (this.colorsForm.pristine) { return; }
    this.moduleService.updateModulePreferences('kastes', this.preferences).pipe(
      filter(resp => resp),
      switchMap(() => this.loginService.reloadPreferences()),
      tap(() => this.colorsForm.markAsPristine()),
    )
      .subscribe();
  }

  onReset() {
    this.colorsForm.reset(this.defaults);
  }

  canDeactivate(): Observable<boolean> {
    return of(this.colorsForm.pristine);
  }

  private parseColors(pref: KastesSettings): Colors {
    const colors = pref.colors;
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
        this.preferences.colors[key] = this.makeColor(this.colors[key]);
      }
    }
  }

  private makeColor(col: Color): string {
    return `hsl(${col.hue},${col.saturation}%,${col.lightness}%)`;
  }

}
