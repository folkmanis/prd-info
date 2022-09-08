import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SystemSettings } from 'src/app/interfaces';
import { PreferencesCardControl, FormGroupType } from '../../preferences-card-control';

type SettingsToChange = Pick<SystemSettings, 'menuExpandedByDefault' | 'hostname'>;

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PreferencesCardControl, useExisting: SystemPreferencesComponent }]
})
export class SystemPreferencesComponent implements PreferencesCardControl<SettingsToChange>, OnDestroy {

  set value(obj: Partial<SettingsToChange>) {
    this.controls.patchValue(obj);
    this.stateChanges.next();
  }
  get value(): Partial<SettingsToChange> {
    return this.controls.value;
  }

  controls = new FormGroup<FormGroupType<SettingsToChange>>({
    menuExpandedByDefault: new FormControl(true),
    hostname: new FormControl('', Validators.required),
  });

  stateChanges = new Subject<void>();


  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
