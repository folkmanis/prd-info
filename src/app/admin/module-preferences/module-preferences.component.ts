import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MODULES, PreferencesDbModule, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {

  fb: IFormBuilder;

  prefForm: IFormGroup<SystemPreferences>;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private cd: ChangeDetectorRef,
    fb: FormBuilder,
  ) {
    this.fb = fb;
    this.prefForm = this.fb.group<SystemPreferences>(
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
    this.systemPreferencesService.preferences$.pipe(
      take(1),
    ).subscribe(prefs => {
      this.prefForm.reset(prefs);
      this.prefForm.markAsPristine();
      this.cd.markForCheck();
    });
  }

  private formToDb(): PreferencesDbModule[] {
    return MODULES.map(module => ({
      module,
      settings: this.prefForm.value[module],
    }));
  }

}
