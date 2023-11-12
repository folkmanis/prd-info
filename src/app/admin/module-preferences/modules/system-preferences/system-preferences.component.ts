import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { SystemSettings } from 'src/app/interfaces';
import { PreferencesCardControl, FormGroupType } from '../../preferences-card-control';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

type SettingsToChange = Pick<SystemSettings, 'menuExpandedByDefault' | 'hostname'>;

@Component({
    selector: 'app-system-preferences',
    templateUrl: './system-preferences.component.html',
    styleUrls: ['./system-preferences.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: PreferencesCardControl, useExisting: SystemPreferencesComponent }],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule]
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
