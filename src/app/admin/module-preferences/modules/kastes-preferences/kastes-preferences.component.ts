import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { KastesSettings } from 'src/app/kastes/interfaces';
import { FormGroupType, PreferencesCardControl } from '../../preferences-card-control';

type KastesSettingsPartial = Partial<KastesSettings>;

@Component({
  selector: 'app-kastes-preferences',
  templateUrl: './kastes-preferences.component.html',
  styleUrls: ['./kastes-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PreferencesCardControl, useExisting: KastesPreferencesComponent }],
})
export class KastesPreferencesComponent implements PreferencesCardControl<KastesSettings>, OnDestroy {


  set value(obj: KastesSettingsPartial) {
    this.controls.patchValue(obj);
  }
  get value(): KastesSettingsPartial {
    return this.controls.getRawValue();
  }

  controls = new FormGroup<FormGroupType<KastesSettings>>({
    colors: new FormControl<KastesSettings['colors']>(null)
  });

  stateChanges = new Subject<void>();


  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
