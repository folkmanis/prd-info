import { Component, computed, effect, inject, linkedSignal, model, signal } from '@angular/core';
import {
  applyWhen,
  disabled,
  form,
  FormField,
  FormRoot,
  min,
  minLength,
  required,
  SchemaPath,
  validate,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FuelType } from 'src/app/interfaces';
import {
  assertNotNull,
  CanComponentDeactivate,
  computedChanges,
  computedSignalChanges,
  ConfirmationDialogService,
  InputUppercaseDirective,
  navigateRelative,
  PendingSuffix,
  SimpleContentContainerComponent,
  updateCatching,
} from 'src/app/library';
import { OdometerReading, Vehicle } from '../schemas/transportation-vehicle';
import { TransportationVehicleService } from '../services/transportation-vehicle.service';
import { TransportationVehiclesListComponent } from '../transportation-vehicles-list/transportation-vehicles-list.component';
import { OdometerReadingsComponent } from './odometer-readings/odometer-readings.component';
import { modelToVehicleCreate, modelToVehicleUpdate, VehicleEdit, vehicleToModel } from './vehicle-edit.model';

@Component({
  selector: 'app-transportation-vehicle-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatCheckbox,
    InputUppercaseDirective,
    MatSelect,
    MatOption,
    MatDivider,
    OdometerReadingsComponent,
    MatCardModule,
    SimpleContentContainerComponent,
    FormField,
    FormRoot,
    PendingSuffix,
  ],
  templateUrl: './transportation-vehicle-edit.component.html',
  styleUrl: './transportation-vehicle-edit.component.scss',
})
export class TransportationVehicleEditComponent implements CanComponentDeactivate {
  #vehicleService = inject(TransportationVehicleService);
  #navigate = navigateRelative();
  #confirmation = inject(ConfirmationDialogService);
  #listComponent = inject(TransportationVehiclesListComponent);

  protected busy = signal(false);
  protected editActive = signal(false);

  #update = updateCatching(this.busy);

  fuelTypes = this.#vehicleService.fuelTypes;
  vehicle = model.required<Vehicle>();

  #initialModel = linkedSignal(() => vehicleToModel(this.vehicle()));

  #vehicleModel = linkedSignal(() => this.#initialModel());
  protected vehicleForm = form(
    this.#vehicleModel,
    (schema) => {
      disabled(schema, { when: () => this.editActive() === false });
      disabled(schema, { when: () => this.busy() });

      required(schema.name, { message: 'Nosaukums ir obligāts' });
      minLength(schema.name, 3, { message: 'Nosaukumam jāsatur vismaz 3 zīmes' });
      this.#validateName(schema.name);

      required(schema.licencePlate, { message: 'Numurs ir obligāts' });
      this.#validateLicencePlate(schema.licencePlate);

      this.#validatepassportNumber(schema.passportNumber);

      this.#validateVin(schema.vin);

      required(schema.fuelType);
      validate(schema.fuelType, ({ value }) =>
        value().type ? null : { kind: 'not_set', message: `Jānorāda obligāti` },
      );

      disabled(schema.consumption, { when: ({ valueOf }) => !valueOf(schema.fuelType).units });
      required(schema.consumption);
      min(schema.consumption, 0, { message: `Jābūt lielākam par nulli` });
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async (tree) => {
          const id = this.vehicle()._id;
          const value = tree().value();
          if (id) {
            await this.#updateVehicle(id, value);
          } else {
            await this.#createVehicle(value);
          }
          this.#listComponent.onReload();
        },
      },
    },
  );

  protected odometerReadings = computed(() => this.vehicle().odometerReadings);

  protected isNew = computed(() => !this.vehicle()._id);

  protected changes = computedSignalChanges(this.#vehicleModel, this.#initialModel);

  protected fuelCompareWith = (o1: FuelType, o2: FuelType) => o1 && o2 && o1.type === o2.type;

  constructor() {
    effect(() => {
      this.#initialModel();
      this.vehicleForm().reset();
      if (this.isNew()) {
        this.editActive.set(true);
      } else {
        this.editActive.set(false);
      }
    });
  }

  canDeactivate() {
    return this.vehicleForm().dirty() === false || this.changes() === null;
  }

  protected onReset() {
    this.#initialModel.set(vehicleToModel(this.vehicle()));
  }

  async onDelete() {
    await this.#update(async (message) => {
      const id = this.vehicle()._id;
      assertNotNull(id);
      const confirmed = await this.#confirmation.confirmDelete();
      if (confirmed) {
        await this.#vehicleService.delete(id);
        this.#listComponent.onReload();
        this.vehicleForm().reset();
        message(`Ieraksts izdzēsts`);
        this.#navigate(['..']);
      }
    });
  }

  protected async onOdometerUpdate(odometerReadings: OdometerReading[]) {
    await this.#update(async (message) => {
      const id = this.vehicle()._id;
      assertNotNull(id);
      const response = await this.#vehicleService.update(id, { odometerReadings });
      message(`Odometra rādījums saglabāts`);
      this.vehicle.set(response);
    });
  }

  async #updateVehicle(id: string, value: VehicleEdit) {
    await this.#update(async (message) => {
      const update = computedChanges(value, this.#initialModel());
      if (update) {
        const response = await this.#vehicleService.update(id, modelToVehicleUpdate(update));
        this.vehicle.set(response);
        message(`Izmaiņas saglabātas`);
        this.#listComponent.onReload();
      } else {
        this.#initialModel.set(vehicleToModel(this.vehicle()));
      }
    });
  }

  async #createVehicle(value: VehicleEdit) {
    await this.#update(async (message) => {
      const { _id } = await this.#vehicleService.create(modelToVehicleCreate(value));
      this.vehicleForm().reset();
      this.#navigate(['..', _id]);
      message(`Ieraksts izveidots`);
    });
  }

  #validateName(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().name,
      (s) => this.#vehicleService.validate(s, 'name'),
    );
  }
  #validateLicencePlate(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().licencePlate,
      (s) => this.#vehicleService.validate(s, 'licencePlate'),
    );
  }
  #validateVin(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().vin,
      (s) => this.#vehicleService.validate(s, 'vin'),
    );
  }
  #validatepassportNumber(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().passportNumber,
      (s) => this.#vehicleService.validate(s, 'passportNumber'),
    );
  }
}
