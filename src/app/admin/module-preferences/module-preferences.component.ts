import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DestroyService } from 'src/app/library/rxjs';
import { Observable, takeUntil } from 'rxjs';
import { MODULES, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SystemPreferencesService } from 'src/app/services';
import { PaytraqPreferencesComponent } from './modules/paytraq-preferences/paytraq-preferences.component';
import { JobsPreferencesComponent } from './modules/jobs-preferences/jobs-preferences.component';
import { KastesPreferencesComponent } from './modules/kastes-preferences/kastes-preferences.component';
import { SystemPreferencesComponent } from './modules/system-preferences/system-preferences.component';
import { CardTitleDirective } from './card-title.directive';
import { PreferencesCardComponent } from './preferences-card/preferences-card.component';
import { ModuleGroupComponent } from './module-group/module-group.component';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  standalone: true,
  imports: [
    ModuleGroupComponent,
    FormsModule,
    ReactiveFormsModule,
    PreferencesCardComponent,
    CardTitleDirective,
    SystemPreferencesComponent,
    KastesPreferencesComponent,
    JobsPreferencesComponent,
    PaytraqPreferencesComponent,
  ],
})
export class ModulePreferencesComponent
  implements OnInit, CanComponentDeactivate
{
  prefForm = this.fb.group<SystemPreferences>(
    Object.assign({}, ...MODULES.map((mod) => ({ [mod]: [{}] })))
  );

  private initialValue: SystemPreferences | undefined;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private cd: ChangeDetectorRef,
    private destroy$: DestroyService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.systemPreferencesService.preferences$
      .pipe(takeUntil(this.destroy$))
      .subscribe((prefs) => {
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
      this.prefForm.getRawValue()
    );
  }

  onResetAll() {
    this.prefForm.reset(this.initialValue);
    this.prefForm.markAsPristine();
  }
}
