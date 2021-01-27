import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MODULES, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { DestroyService } from 'src/app/library/rx';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {

  fb: IFormBuilder;

  prefForm: IFormGroup<SystemPreferences>;

  private initialValue: SystemPreferences | undefined;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private cd: ChangeDetectorRef,
    private destroy$: DestroyService,
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
    this.systemPreferencesService.preferences$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(prefs => {
      this.prefForm.reset(prefs);
      this.prefForm.markAsPristine();
      this.initialValue = prefs;
      this.cd.markForCheck();
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.prefForm.pristine;
  }

  onSaveAll() {
    this.systemPreferencesService.updatePreferences(
      this.prefForm.value
    );
  }

  onResetAll() {
    this.prefForm.reset(this.initialValue);
    this.prefForm.markAsPristine();
  }

}
