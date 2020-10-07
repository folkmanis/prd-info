import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap, take } from 'rxjs/operators';
import { KastesSettings } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services';
import { PreferencesComponent } from '../preferences-component.class';

interface Color {
  hue: number;
  saturation: number;
  lightness: number;
}

interface Colors {
  yellow: Color;
  rose: Color;
  white: Color;
}

@Component({
  selector: 'app-kastes-preferences',
  templateUrl: './kastes-preferences.component.html',
  styleUrls: ['./kastes-preferences.component.scss']
})
export class KastesPreferencesComponent implements OnInit, OnDestroy, PreferencesComponent {

  private hslRegex = /hsl\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%\)/;
  constructor(
    private fb: FormBuilder,
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  preferences: KastesSettings;
  colors: Colors;
  keys: string[] = [];
  colorsForm: FormGroup;
  defaults: { [key: string]: number; } = {};
  unsub = new Subject<void>();

  ngOnInit() {
    this.systemPreferencesService.getModulePreferences('kastes').pipe(
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
    this.systemPreferencesService.updateModulePreferences('kastes', this.preferences).pipe(
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
