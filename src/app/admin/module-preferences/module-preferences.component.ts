import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { updateCatching } from 'src/app/library/update-catching';
import { SystemPreferencesService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { CardTitleDirective } from './card-title.directive';
import { JobsPreferencesComponent } from './modules/jobs-preferences/jobs-preferences.component';
import { KastesPreferencesComponent } from './modules/kastes-preferences/kastes-preferences.component';
import { PaytraqPreferencesComponent } from './modules/paytraq-preferences/paytraq-preferences.component';
import { SystemPreferencesComponent } from './modules/system-preferences/system-preferences.component';
import { TransportationPreferencesComponent } from './modules/transportation-preferences/transportation-preferences.component';
import { PreferencesCardComponent } from './preferences-card/preferences-card.component';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    FormField,
    FormRoot,
    PreferencesCardComponent,
    CardTitleDirective,
    SystemPreferencesComponent,
    KastesPreferencesComponent,
    JobsPreferencesComponent,
    PaytraqPreferencesComponent,
    TransportationPreferencesComponent,
    MatToolbar,
    MatButton,
  ],
})
export class ModulePreferencesComponent implements CanComponentDeactivate {
  #systemPreferencesService = inject(SystemPreferencesService);

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  private savedConfiguration = configuration();

  #preferencesModel = linkedSignal(() => this.savedConfiguration());
  protected preferencesForm = form(
    this.#preferencesModel,
    (s) => {
      disabled(s, () => this.busy());
    },
    {
      submission: {
        action: async (f) => {
          this.#update(async (message) => {
            const value = f().value();
            await this.#systemPreferencesService.updatePreferences(value);
            message(`Iestatījumi saglabāti`);
            f().reset();
          });
        },
      },
    },
  );

  canDeactivate() {
    return this.preferencesForm().dirty() === false;
  }

  onResetAll() {
    this.preferencesForm().reset(this.savedConfiguration());
  }
}
