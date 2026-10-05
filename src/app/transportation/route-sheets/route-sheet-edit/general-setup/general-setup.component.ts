import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal, output } from '@angular/core';
import { applyWhen, disabled, form, FormField, FormRoot, max, min, required, SchemaPath } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { notNullOrThrow } from 'src/app/library/assert-utils';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { computedSignalChanges, nonNullResource } from 'src/app/library/signals';
import { RouteSheet, RouteSheetCreate, RouteSheetUpdate } from '../../schemas';
import { RouteSheetService } from '../../services/route-sheet.service';
import { TransportationDriverService } from '../../../drivers';
import { TransportationVehicleService } from '../../../vehicles';
import { GeneralSetupModel, GeneralSetupModelService } from './general-setup.model.service';

@Component({
  selector: 'app-general-setup',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatOption,
    MatIconButton,
    MatIcon,
    MatTooltip,
    DatePipe,
    TitleCasePipe,
    FormField,
    MatCardModule,
    MatButton,
    FormRoot,
    DecimalPipe,
  ],
  templateUrl: './general-setup.component.html',
  styleUrl: './general-setup.component.scss',
})
export class GeneralSetupComponent implements CanComponentDeactivate {
  readonly #routeSheetService = inject(RouteSheetService);
  readonly #modelService = inject(GeneralSetupModelService);

  protected months = this.#monthsArray();

  busy = input(false);

  create = output<RouteSheetCreate>();
  update = output<RouteSheetUpdate>();
  cancelSetup = output<void>();

  routeSheet = input.required<RouteSheet | null>();

  #initialModel = computed(() => this.#modelService.routeSheetToModel(this.routeSheet()));
  #routeSheetModel = linkedSignal(() => this.#initialModel());
  protected routeSheetForm = form(
    this.#routeSheetModel,
    (schema) => {
      disabled(schema, { when: () => this.busy() });

      required(schema.year);
      min(schema.year, 1990);

      required(schema.month);
      min(schema.month, 1);
      max(schema.month, 12);

      required(schema.fuelRemainingStartLitres);
      min(schema.fuelRemainingStartLitres, 0);

      required(schema.vehicle);
      required(schema.driver);

      this.#validateDuplicate(schema);
    },
    {
      submission: {
        action: async () => {
          const id = this.routeSheet()?._id;
          if (id) {
            this.update.emit(await this.#modelService.modelToRouteSheetUpdate(notNullOrThrow(this.changes())));
          } else {
            this.create.emit(await this.#modelService.modelToRouteSheetCreate(this.#routeSheetModel()));
            this.routeSheetForm().reset();
          }
        },
      },
    },
  );

  protected changes = computedSignalChanges(this.#routeSheetModel, this.#initialModel);

  readonly #driverService = inject(TransportationDriverService);
  #drivers = nonNullResource(this.#driverService.getDriversResource(), []);
  protected activeDrivers = computed(() => this.#drivers.value().filter((d) => !d.disabled));
  protected disabledDrivers = computed(() => this.#drivers.value().filter((d) => d.disabled));

  #vehicleService = inject(TransportationVehicleService);
  #vehicles = nonNullResource(this.#vehicleService.getVehiclesResource(), []);
  protected activeVehicles = computed(() => this.#vehicles.value().filter((v) => !v.disabled));
  protected disabledVehicles = computed(() => this.#vehicles.value().filter((v) => v.disabled));

  protected vehicle = computed(() => {
    if (this.#vehicles.hasValue()) {
      const { vehicle } = this.#routeSheetModel();
      return this.#vehicles.value().find((v) => v._id === vehicle);
    } else {
      return undefined;
    }
  });
  #licencePlate = computed(() => this.vehicle()?.licencePlate);
  historicalData = this.#routeSheetService.getHistoricalDataResource(this.#licencePlate);

  constructor() {
    effect(() => {
      this.#initialModel();
      this.routeSheetForm().reset();
    });
  }

  protected setRemainingFuel(value: number) {
    this.#routeSheetModel.update((m) => ({ ...m, fuelRemainingStartLitres: value }));
  }

  canDeactivate = () => this.routeSheetForm().touched() === false || this.changes() === null;

  #monthsArray(): Date[] {
    const year = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, k) => k).map((month) => new Date(year, month));
  }

  #validateDuplicate(schema: SchemaPath<GeneralSetupModel>): void {
    applyWhen(
      schema,
      ({ value }) => {
        const { year, month, vehicle, driver } = value();
        const initial = this.#initialModel();
        return (
          year !== initial.year || month !== initial.month || vehicle !== initial.vehicle || driver !== initial.driver
        );
      },
      (s) => this.#routeSheetService.validateDuplicateRouteSheet(s),
    );
  }
}
