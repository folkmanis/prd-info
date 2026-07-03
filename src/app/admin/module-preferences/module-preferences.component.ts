import { Component, inject, linkedSignal, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { firstValueFrom } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { LocationSelectService } from 'src/app/library/location-select';
import { SimpleListTableComponent } from 'src/app/library/simple-list-table/simple-list-table.component';
import { updateCatching } from 'src/app/library/update-catching';
import { SystemPreferencesService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { CardTitleDirective } from './card-title.directive';
import { CategoryDialogComponent } from './jobs-settings/category-dialog/category-dialog.component';
import { validateJobsSettings } from './jobs-settings/jobs-settings.model';
import { UnitsDialogComponent } from './jobs-settings/units-dialog/units-dialog.component';
import { ColorSliderComponent } from './kastes-settings/color-slider/color-slider.component';
import { validateKastesSettings } from './kastes-settings/kastes-settings.model';
import { toModel, toUpdate } from './module-preferences.model';
import { validatePaytraqSettings } from './paytraq-settings/paytraq-settings.model';
import { PreferencesCardComponent } from './preferences-card/preferences-card.component';
import { validateSystemSettings } from './system-settings/system-settings.model';
import { FuelTypeDialogComponent } from './transportation-settings/fuel-type-dialog/fuel-type-dialog.component';
import { validateTransportationSettingsModel } from './transportation-settings/transportation-settings.model';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss'],
  imports: [
    FormField,
    FormRoot,
    PreferencesCardComponent,
    CardTitleDirective,
    MatToolbar,
    MatButton,
    MatCheckbox,
    MatDivider,
    MatIcon,
    SimpleListTableComponent,
    MatFormFieldModule,
    ColorSliderComponent,
    MatInput,
    MatIconButton,
  ],
})
export class ModulePreferencesComponent implements CanComponentDeactivate {
  #systemPreferencesService = inject(SystemPreferencesService);
  #locationSelectService = inject(LocationSelectService);
  protected locationEnabled = this.#locationSelectService.serviceEnabled;

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  #savedConfiguration = configuration();

  #preferencesModel = linkedSignal(() => toModel(this.#savedConfiguration()));
  protected form = form(
    this.#preferencesModel,
    (schema) => {
      disabled(schema, { when: () => this.busy() });

      validateSystemSettings(schema.system);
      validatePaytraqSettings(schema.paytraq);
      validateKastesSettings(schema.kastes);
      validateJobsSettings(schema.jobs);
      validateTransportationSettingsModel(schema.transportation);
    },
    {
      submission: {
        action: async (tree) => {
          this.#update(async (message) => {
            const update = toUpdate(tree().value());
            await this.#systemPreferencesService.updatePreferences(update);
            message(`Iestatījumi saglabāti`);
            tree().reset();
          });
        },
      },
    },
  );

  categoryDialog = CategoryDialogComponent;
  unitsDialog = UnitsDialogComponent;
  fuelTypeDialog = FuelTypeDialogComponent;

  canDeactivate() {
    return this.form().dirty() === false;
  }

  onResetAll() {
    const saved = this.#savedConfiguration();
    this.form().reset(toModel(saved));
  }

  async onMap() {
    const { googleId, address } = this.#preferencesModel().transportation.shippingAddress;
    const marker = await firstValueFrom(this.#locationSelectService.getLocation({ googleId, address }));
    if (marker) {
      this.form.transportation.shippingAddress().value.update((value) => ({
        ...value,
        address: marker.address,
        googleId: marker.googleId,
        zip: marker.zip ?? '',
        country: marker.country ?? '',
      }));
    }
  }
}
