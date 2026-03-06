import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { disabled, form, FormField, max, min, required, submit } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { pick } from 'lodash-es';
import { assertNotNull, notNullOrThrow } from 'src/app/library/assert-utils';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { navigateRelative } from 'src/app/library/navigation';
import { computedSignalChanges } from 'src/app/library/signals';
import { updateCatching } from 'src/app/library/update-catching';
import { TransportationDriver } from 'src/app/transportation/interfaces/transportation-driver';
import {
  TransportationRouteSheet,
  TransportationRouteSheetCreate,
  TransportationRouteSheetUpdate,
} from 'src/app/transportation/interfaces/transportation-route-sheet';
import { TransportationVehicle } from 'src/app/transportation/interfaces/transportation-vehicle';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { RouteSheetListComponent } from '../../route-sheet-list/route-sheet-list.component';

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
    ConfirmationDirective,
  ],
  templateUrl: './general-setup.component.html',
  styleUrl: './general-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralSetupComponent implements CanComponentDeactivate {
  readonly #routeSheetService = inject(RouteSheetService);
  readonly #navigate = navigateRelative();
  readonly #listComponent = inject(RouteSheetListComponent);

  #year = new Date().getFullYear();
  protected months = Array.from({ length: 12 }, (_, k) => k).map((month) => new Date(this.#year, month));

  protected busy = signal(false);
  protected editActive = linkedSignal(() => (this.initialValue()._id ? false : true));

  readonly #updateFn = updateCatching(this.busy);

  routeSheet = input.required<TransportationRouteSheet>();
  protected initialValue = linkedSignal(() => this.routeSheet());
  #initialModel = computed(() => this.#toFormModel(this.initialValue()));

  #routeSheetModel = signal({
    year: this.#year,
    month: new Date().getMonth() + 1,
    fuelRemainingStartLitres: 0,
    driverId: '',
    vehicleId: '',
  });
  protected routeSheetForm = form(this.#routeSheetModel, (schema) => {
    disabled(schema, () => this.busy() || this.editActive() === false);

    required(schema.year);
    min(schema.year, 1990);

    required(schema.month);
    min(schema.month, 1);
    max(schema.month, 12);

    required(schema.fuelRemainingStartLitres);
    min(schema.fuelRemainingStartLitres, 0);

    required(schema.driverId);
    required(schema.vehicleId);
  });

  protected changes = computedSignalChanges(this.#routeSheetModel, this.#initialModel);

  drivers = input<TransportationDriver[]>([]);
  activeDrivers = computed(() => this.drivers()?.filter((d) => !d.disabled) ?? []);
  disabledDrivers = computed(() => this.drivers()?.filter((d) => d.disabled) ?? []);

  vehicles = input<TransportationVehicle[]>([]);
  activeVehicles = computed(() => this.vehicles().filter((v) => !v.disabled));
  disabledVehicles = computed(() => this.vehicles().filter((v) => v.disabled));

  protected vehicle = computed(() => {
    if (this.editActive() === false) {
      return undefined;
    }
    const { vehicleId } = this.#routeSheetModel();
    return this.vehicles().find((v) => v._id === vehicleId);
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

  protected async onSubmit() {
    submit(this.routeSheetForm, async () => {
      await this.#updateFn(async (message) => {
        const { _id: id } = this.initialValue();
        if (id) {
          const updated = await this.#updateRouteSheet(id);
          this.initialValue.set(updated);
          message(`Dati saglabāti!`);
        } else {
          const created = await this.#createRouteSheet();
          this.routeSheetForm().reset();
          message(`Ieraksts izveidots!`);
          this.#navigate(['..', created._id]);
        }
      });
      this.#listComponent.onReload();
    });
  }

  onReset() {
    this.#routeSheetModel.set(this.#initialModel());
    this.routeSheetForm().reset();
    this.editActive.set(false);
  }

  async onDelete() {
    this.#updateFn(async (message) => {
      const { _id: id } = this.initialValue();
      assertNotNull(id);
      await this.#routeSheetService.deleteRouteSheet(id);
      this.routeSheetForm().reset();
      message(`Ieraksts izdzēsts!`);
      this.#navigate(['../..']);
      this.#listComponent.onReload();
    });
  }

  canDeactivate = () => this.routeSheetForm().touched() === false || this.changes() === null;

  #toFormModel(data: TransportationRouteSheet) {
    return {
      year: data.year,
      month: data.month,
      fuelRemainingStartLitres: data.fuelRemainingStartLitres,
      driverId: data.driver._id,
      vehicleId: data.vehicle._id,
    };
  }

  async #updateRouteSheet(id: string): Promise<TransportationRouteSheet> {
    const update = this.#toUpdate(notNullOrThrow(this.changes()));
    return this.#routeSheetService.updateRouteSheet(id, update);
  }

  async #createRouteSheet(): Promise<TransportationRouteSheet> {
    const create = this.#toCreate(this.#routeSheetModel());
    return this.#routeSheetService.createRouteSheet(create);
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
    const driver = this.drivers().find((d) => d._id === id);
    assertNotNull(driver);
    return driver;
  }

  #findVehicle(id: string): TransportationVehicle {
    const vehicle = this.vehicles().find((v) => v._id === id);
    assertNotNull(vehicle);
    return vehicle;
  }
}
