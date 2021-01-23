import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DbModulePreferences, MODULES, ModuleSettings, SystemPreferencesGroups } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SystemPreferencesService } from 'src/app/services';

type PreferencesFormValue = {
  [key in SystemPreferencesGroups]: ModuleSettings;
};

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {

  fb: IFormBuilder;

  prefForm: IFormGroup<PreferencesFormValue>;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private cd: ChangeDetectorRef,
    fb: FormBuilder,
  ) {
    this.fb = fb;
    this.prefForm = this.fb.group<PreferencesFormValue>(
      Object.assign(
        {},
        ...MODULES.map(mod => ({ [mod]: [{}] }))
      )
    );
  }

  ngOnInit() {
    this.onResetAll();
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.prefForm.pristine;
  }

  onSaveAll() {
    this.systemPreferencesService.updatePreferences(
      this.formToDb()
    ).subscribe(_ => {
      this.prefForm.markAsPristine();
      this.cd.markForCheck();
    });
  }

  onResetAll() {
    this.formStateFromApi().pipe(
      take(1),
    ).subscribe(prefs => {
      this.prefForm.reset(prefs);
      this.prefForm.markAsPristine();
      this.cd.markForCheck();
    });
  }

  private formStateFromApi(): Observable<PreferencesFormValue> {
    return this.systemPreferencesService.sysPreferences$.pipe(
      map(prefs => Object.assign({}, ...MODULES.map(mod => ({ [mod]: prefs.get(mod) })))),
    );
  }

  private formToDb(): DbModulePreferences[] {
    return MODULES.map(module => ({
      module,
      settings: this.prefForm.value[module],
    }));
  }

}
