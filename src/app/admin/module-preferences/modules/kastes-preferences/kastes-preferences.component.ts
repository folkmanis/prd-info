import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { Colors, COLORS, KastesSettings } from 'src/app/kastes/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';

type KastesSettingsPartial = Partial<KastesSettings>;

@Component({
  selector: 'app-kastes-preferences',
  templateUrl: './kastes-preferences.component.html',
  styleUrls: ['./kastes-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PreferencesCardControl, useExisting: KastesPreferencesComponent }],
})
export class KastesPreferencesComponent implements PreferencesCardControl<KastesSettings>, OnDestroy {

  readonly colors = [...COLORS];

  set value(obj: KastesSettingsPartial) {
    this.controls.patchValue(obj);
  }
  get value(): KastesSettingsPartial {
    return this.controls.getRawValue();
  }

  controls = this.fb.group({
    colors: this.fb.group<{ [key in Colors]: string; }>(
      Object.assign({}, ...COLORS.map(col => ({ [col]: '' })))
    )
  });

  stateChanges = new Subject<void>();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
