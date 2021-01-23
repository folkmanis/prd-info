import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Subject } from 'rxjs';
import { Colors, COLORS, KastesSettings } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';

type KastesSettingsPartial = Partial<KastesSettings>;

@Component({
  selector: 'app-kastes-preferences',
  templateUrl: './kastes-preferences.component.html',
  styleUrls: ['./kastes-preferences.component.scss'],
  providers: [{ provide: PreferencesCardControl, useExisting: KastesPreferencesComponent }],
})
export class KastesPreferencesComponent implements PreferencesCardControl<KastesSettings>, OnDestroy {

  readonly colors = [...COLORS];

  set value(obj: KastesSettingsPartial) {
    this.controls.patchValue(obj);
  }
  get value(): KastesSettingsPartial {
    return this.controls.value;
  }

  controls: IFormGroup<KastesSettingsPartial>;

  stateChanges = new Subject<void>();

  private fb: IFormBuilder;

  constructor(
    fb: FormBuilder,
  ) {
    this.fb = fb;
    this.controls = this.fb.group<KastesSettingsPartial>({
      colors: this.fb.group<{ [key in Colors]: string; }>(
        Object.assign({}, ...COLORS.map(col => ({ [col]: '' })))
      )
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}