import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Subject } from 'rxjs';
import { SystemSettings } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';

type SystemSettingsPartial = Partial<SystemSettings>;

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
  providers: [{ provide: PreferencesCardControl, useExisting: SystemPreferencesComponent }]
})
export class SystemPreferencesComponent implements PreferencesCardControl<SystemSettings>, OnDestroy {

  set value(obj: Partial<SystemSettings>) {
    this.controls.patchValue(obj);
    this.stateChanges.next();
  }
  get value(): Partial<SystemSettings> {
    return this.controls.value;
  }

  controls: IFormGroup<Partial<SystemSettings>>;

  stateChanges = new Subject<void>();

  private fb: IFormBuilder;

  constructor(
    fb: FormBuilder,
  ) {
    this.fb = fb;
    this.controls = this.fb.group<SystemSettingsPartial>({
      menuExpandedByDefault: [true],
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
