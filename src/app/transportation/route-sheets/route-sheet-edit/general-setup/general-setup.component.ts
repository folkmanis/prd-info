import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { disabled, form, FormField, FormRoot, max, min, required } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { pick } from 'lodash-es';
import { assertNotNull, notNullOrThrow } from 'src/app/library/assert-utils';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { computedSignalChanges } from 'src/app/library/signals';
import { TransportationDriver } from 'src/app/transportation/interfaces/transportation-driver';
import {
  TransportationRouteSheet,
  TransportationRouteSheetCreate,
  TransportationRouteSheetUpdate,
} from 'src/app/transportation/interfaces/transportation-route-sheet';
import { TransportationVehicle } from 'src/app/transportation/interfaces/transportation-vehicle';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { TransportationDriverService } from 'src/app/transportation/services/transportation-driver.service';
import { TransportationVehicleService } from 'src/app/transportation/services/transportation-vehicle.service';

interface RouteSheetModel {
  year: number;
  month: number;
  fuelRemainingStartLitres: number;
  driverId: string;
  vehicleId: string;
}

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
  ],
  templateUrl: './general-setup.component.html',
  styleUrl: './general-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralSetupComponent implements CanComponentDeactivate {
  readonly #routeSheetService = inject(RouteSheetService);

  #year = new Date().getFullYear();
  protected months = Array.from({ length: 12 }, (_, k) => k).map((month) => new Date(this.#year, month));

  busy = input(false);

  create = output<TransportationRouteSheetCreate>();
  update = output<TransportationRouteSheetUpdate>();
  cancel = output<void>();

  routeSheet = input.required<TransportationRouteSheet>();
  #initialModel = computed(() => this.#toFormModel(this.routeSheet()));

  #routeSheetModel = signal({
    year: this.#year,
    month: new Date().getMonth() + 1,
    fuelRemainingStartLitres: 0,
    vehicleId: '',
    driverId: '',
  });
  protected routeSheetForm = form(
    this.#routeSheetModel,
    (schema) => {
      disabled(schema, () => this.busy());

      required(schema.year);
      min(schema.year, 1990);

      required(schema.month);
      min(schema.month, 1);
      max(schema.month, 12);

      required(schema.fuelRemainingStartLitres);
      min(schema.fuelRemainingStartLitres, 0);

      required(schema.vehicleId);
      required(schema.driverId);
    },
    {
      submission: {
        action: async () => {
          const { _id: id } = this.routeSheet();
          if (id) {
            this.update.emit(this.#toUpdate(notNullOrThrow(this.changes())));
          } else {
            this.create.emit(this.#toCreate(this.#routeSheetModel()));
            this.routeSheetForm().reset();
          }
        },
      },
    },
  );

  protected changes = computedSignalChanges(this.#routeSheetModel, this.#initialModel);

  #drivers = inject(TransportationDriverService).getDriversResource();
  protected activeDrivers = computed(() =>
    this.#drivers.hasValue() ? this.#drivers.value().filter((d) => !d.disabled) : [],
  );
  protected disabledDrivers = computed(() =>
    this.#drivers.hasValue() ? this.#drivers.value().filter((d) => d.disabled) : [],
  );

  #vehicles = inject(TransportationVehicleService).getVehiclesResource();
  protected activeVehicles = computed(() =>
    this.#vehicles.hasValue() ? this.#vehicles.value().filter((v) => !v.disabled) : [],
  );
  protected disabledVehicles = computed(() =>
    this.#vehicles.hasValue() ? this.#vehicles.value().filter((v) => v.disabled) : [],
  );

  protected vehicle = computed(() => {
    if (this.#vehicles.hasValue()) {
      const { vehicleId } = this.#routeSheetModel();
      return this.#vehicles.value().find((v) => v._id === vehicleId);
    } else {
      return undefined;
    }
  });
  #licencePlate = computed(() => this.vehicle()?.licencePlate);
  historicalData = this.#routeSheetService.getHistoricalDataResource(this.#licencePlate);

  constructor() {
    effect(() => {
      this.#routeSheetModel.set(this.#initialModel());
      untracked(() => {
        this.routeSheetForm().reset();
      });
    });
  }

  protected setRemainingFuel(value: number) {
    this.#routeSheetModel.update((m) => ({ ...m, fuelRemainingStartLitres: value }));
  }

  canDeactivate = () => this.routeSheetForm().touched() === false || this.changes() === null;

  #toFormModel(data: TransportationRouteSheet) {
    return {
      year: data.year,
      month: data.month,
      fuelRemainingStartLitres: data.fuelRemainingStartLitres,
      vehicleId: data.vehicle._id,
      driverId: data.driver._id,
    };
  }

  #toUpdate(model: Partial<RouteSheetModel>): TransportationRouteSheetUpdate {
    const update: TransportationRouteSheetUpdate = pick(model, ['month', 'year', 'fuelRemainingStartLitres']);
    if (model.driverId) {
      update.driver = this.#findDriver(model.driverId);
    }
    if (model.vehicleId) {
      update.vehicle = this.#findVehicle(model.vehicleId);
    }
    return update;
  }

  #toCreate(model: RouteSheetModel): TransportationRouteSheetCreate {
    return {
      ...model,
      driver: this.#findDriver(model.driverId),
      vehicle: this.#findVehicle(model.vehicleId),
      fuelPurchases: [],
      trips: [],
    };
  }

  #findDriver(id: string): TransportationDriver {
    const driver = this.#drivers.hasValue() ? this.#drivers.value().find((d) => d._id === id) : null;
    assertNotNull(driver);
    return driver;
  }

  #findVehicle(id: string): TransportationVehicle {
    const vehicle = this.#vehicles.hasValue() ? this.#vehicles.value().find((v) => v._id === id) : null;
    assertNotNull(vehicle);
    return vehicle;
  }
}
