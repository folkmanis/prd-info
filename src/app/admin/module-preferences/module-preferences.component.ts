import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MODULES, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SystemPreferencesService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { CardTitleDirective } from './card-title.directive';
import { ModuleGroupComponent } from './module-group/module-group.component';
import { JobsPreferencesComponent } from './modules/jobs-preferences/jobs-preferences.component';
import { KastesPreferencesComponent } from './modules/kastes-preferences/kastes-preferences.component';
import { PaytraqPreferencesComponent } from './modules/paytraq-preferences/paytraq-preferences.component';
import { SystemPreferencesComponent } from './modules/system-preferences/system-preferences.component';
import { PreferencesCardComponent } from './preferences-card/preferences-card.component';
import { TransportationPreferencesComponent } from './transportation-preferences/transportation-preferences.component';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
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
    TransportationPreferencesComponent,
  ],
})
export class ModulePreferencesComponent implements CanComponentDeactivate {
  private systemPreferencesService = inject(SystemPreferencesService);

  private savedConfiguration = configuration();

  prefForm = inject(FormBuilder).group<SystemPreferences>(Object.assign({}, ...MODULES.map((mod) => ({ [mod]: [{}] }))));

  constructor() {
    effect(
      () => {
        this.prefForm.reset(this.savedConfiguration());
        this.prefForm.markAsPristine();
      },
      { allowSignalWrites: true },
    );
  }

  canDeactivate(): boolean | Observable<boolean> {
    return this.prefForm.pristine;
  }

  onSaveAll() {
    this.systemPreferencesService.updatePreferences(this.prefForm.getRawValue());
  }

  onResetAll() {
    this.prefForm.reset(this.savedConfiguration());
    this.prefForm.markAsPristine();
  }
}
