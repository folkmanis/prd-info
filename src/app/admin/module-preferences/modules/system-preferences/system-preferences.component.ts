import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SystemSettings } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  controls: UntypedFormGroup;

  stateChanges = new Subject<void>();

  constructor(
    fb: UntypedFormBuilder,
  ) {
    this.controls = fb.group({
      menuExpandedByDefault: [true],
      hostname: [
        null,
        {
          validators: [Validators.required]
        }
      ]
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
